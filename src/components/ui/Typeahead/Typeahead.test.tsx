import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Typeahead } from './Typeahead'

function Harness() {
  const [value, setValue] = useState<string[]>([])
  return (
    <Typeahead
      value={value}
      onChange={setValue}
      suggestions={['shoes', 'sneakers', 'running']}
      placeholder="Add keywords"
    />
  )
}

describe('Typeahead', () => {
  it('filters suggestions and adds a chip when an option is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'sho')

    const option = screen.getByRole('option', { name: 'shoes' })
    await user.click(option)

    expect(screen.getAllByTestId('chip')).toHaveLength(1)
    expect(screen.getByText('shoes')).toBeTruthy()
  })

  it('ignores duplicate keywords (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'running{Enter}')
    await user.type(input, 'RUNNING{Enter}')

    expect(screen.getAllByTestId('chip')).toHaveLength(1)
  })

  it('removes a chip via its remove button', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'sneakers{Enter}')
    expect(screen.getAllByTestId('chip')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Remove sneakers' }))
    expect(screen.queryAllByTestId('chip')).toHaveLength(0)
  })
})
