import { mount } from '@vue/test-utils'
// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import UserPage from '../../pages/user/[id].vue'

// Mock useFetch and useRoute
vi.mock('#app', () => ({
  useRoute: () => ({
    params: {
      id: '1',
    },
  }),
  navigateTo: vi.fn(),
}))

// Mock useFetch
vi.mock('#build/imports', () => ({
  useFetch: () => ({
    data: {
      value: {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: {
          street: 'Test Street',
          suite: 'Apt 123',
          city: 'Test City',
          zipcode: '12345',
          geo: {
            lat: '0',
            lng: '0',
          },
        },
        company: {
          name: 'Test Company',
          catchPhrase: 'Test Catch Phrase',
          bs: 'Test BS',
        },
      },
    },
    pending: { value: false },
    error: { value: null },
    refresh: vi.fn(),
  }),
}))

describe('user Page', () => {
  it('displays user information correctly', () => {
    const wrapper = mount(UserPage)
    expect(wrapper.html()).toContain('用户详情 #1')
    expect(wrapper.html()).toContain('Test User')
    expect(wrapper.html()).toContain('testuser')
    expect(wrapper.html()).toContain('test@example.com')
    expect(wrapper.html()).toContain('123-456-7890')
  })
})
