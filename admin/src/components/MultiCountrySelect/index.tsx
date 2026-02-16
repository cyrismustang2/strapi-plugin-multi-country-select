import React, { useMemo, useState, useEffect } from 'react'
import {
  Tag,
  Field,
  Flex,
} from '@strapi/design-system'
import { Cross } from '@strapi/icons'
import ReactSelect from 'react-select'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { getTranslation } from '../../utils/getTrad'

const CustomMultiValueContainer = (props: any) => {
  const { selectProps } = props
  const handleTagClick = (value: any) => (e: any) => {
    e.preventDefault()
    selectProps.onChange(selectProps.value.filter((v: any) => v !== value))
  }
  return (
    <Tag
      type="button"
      tabIndex={-1}
      icon={<Cross />}
      onClick={handleTagClick(props.data)}>
      {props.data.label}
    </Tag>
  )
}

const StyleSelect = styled(ReactSelect)`
  .select-control {
    height: auto;
    & > div:first-child {
      padding: 4px;
      gap: 4px;
      & > div {
        padding-left: 8px;
      }
    }
    .select-multi-value-container {
      margin-right: -8px;
    }
  }
  .option-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`

const MultiCountrySelect = React.forwardRef((props: any, _ref: any): any => {
  const { attribute, name, onChange, required, value, error, placeholder } = props;
  
  const [allIsSelected, setAllIsSelected] = useState(false)

  const { formatMessage, messages } = useIntl()
  const countries = messages[getTranslation('countries')] as string || '{}';

  const parsedOptions: {[key: string]: string} = JSON.parse(countries);

  const possibleOptions = useMemo(() => {
    return [
      ...(attribute['options-extra'] || [])
        .map((option: any) => {
          const [value, label] = [...option.split(':'), option]
          if (!label || !value) return null
          return { label, value, disabled: allIsSelected }
        })
        .filter(Boolean),
      {
        label: 'All',
        value: 'ALL',
      },
      ...Object.entries(parsedOptions).map(([value, label]) => ({
        label,
        value,
        disabled: allIsSelected,
      })),
    ]
  }, [allIsSelected, attribute])

  const sanitizedValue = useMemo(() => {
    let parsedValue
    try {
      parsedValue = JSON.parse(value) || []
    } catch (e) {
      parsedValue = value || []
    }
    return Array.isArray(parsedValue)
      ? possibleOptions.filter((option) =>
          parsedValue.some((val) => option.value === val),
        )
      : []
  }, [value, possibleOptions])

  const handleChange = (val: any) => {
    onChange({
      target: {
        name: name,
        value:
          val?.length && val.filter((v: any) => !!v).length
            ? JSON.stringify(val.filter((v: any) => !!v).map((v: any) => v.value))
            : "[]",
        type: attribute.type,
      },
    })
  }

  useEffect(() => {
    value && value.indexOf('ALL') !== -1
      ? setAllIsSelected(true)
      : setAllIsSelected(false)
  }, [value])

  const fieldError = useMemo(() => {
    return error || (required && !possibleOptions.length ? 'No options' : null)
  }, [required, error, possibleOptions])

  return (
    <Field.Root
      hint={formatMessage({
          id: getTranslation('description'),
          defaultMessage: 'Select multiple countries',
      })}
      error={fieldError}
      name={name}
      required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label>{formatMessage({
          id: getTranslation('label'),
          defaultMessage: 'Multi Countries',
        })}</Field.Label>
        <StyleSelect
          isSearchable
          isMulti
          name={name}
          id={name}
          placeholder={placeholder}
          defaultValue={sanitizedValue}
          value={sanitizedValue}
          components={{
            MultiValueContainer: CustomMultiValueContainer,
          }}
          options={possibleOptions}
          isOptionDisabled={(option: any) => option.disabled}
          onChange={(val: any) => {
            if (val.find((v: any) => v.value === 'ALL')) {
              return handleChange([{ label: 'All', value: 'ALL' }])
            }
            handleChange(val.filter(Boolean))
          }}
          classNames={{
            control: (_state) => 'select-control',
            multiValue: (_state) => 'select-multi-value',
            placeholder: (_state) => 'select-placeholder',
            option: ({ isDisabled }) => (isDisabled ? 'option-disabled' : ''),
          }}
        />
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  )
})

export default MultiCountrySelect