import { expect, test } from '@nuxt/test-utils/playwright'

test('dynamic routing works correctly', async ({ page, goto }) => {
  // 首先访问主页
  await goto('/')

  // 确认主页已加载
  await expect(page.locator('h1')).toContainText('首页')

  // 点击第一个用户链接
  await page.getByText('用户 1').click()

  // 等待页面加载
  await page.waitForURL(/\/user\/1/)

  // 验证用户页面已加载
  await expect(page.locator('h1')).toContainText('用户详情 #1')

  // 等待用户数据加载
  await page.waitForSelector('text=姓名')

  // 验证用户数据存在
  const nameElement = page.locator('text=姓名').locator('xpath=following-sibling::p')
  await expect(nameElement).toBeVisible()

  // 点击"下一个用户"按钮
  await page.getByText('下一个用户').click()

  // 等待页面加载
  await page.waitForURL(/\/user\/2/)

  // 验证我们现在在用户2页面
  await expect(page.locator('h1')).toContainText('用户详情 #2')

  // 点击"返回首页"链接
  await page.getByText('返回首页').click()

  // 等待导航回到首页
  await page.waitForURL('/')

  // 验证我们返回到了首页
  await expect(page.locator('h1')).toContainText('首页')
})
