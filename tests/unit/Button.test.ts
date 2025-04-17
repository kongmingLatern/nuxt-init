// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../../components/Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button)
    expect(wrapper.text()).toBe('Button')
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    const clickEvent = wrapper.emitted('click')
    expect(clickEvent).toBeTruthy()
    expect(clickEvent?.length).toBe(1)
  })

  it('applies full width class when block prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        block: true
      }
    })
    expect(wrapper.classes()).toContain('w-full')
  })
}) 