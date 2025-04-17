<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8">按钮组件展示</h1>
    
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">按钮变体</h2>
      <div class="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
    </section>
    
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">按钮尺寸</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </section>
    
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">块级按钮</h2>
      <div class="space-y-4 max-w-md">
        <Button block>Block Button</Button>
        <Button block variant="secondary">Block Secondary</Button>
        <Button block variant="success">Block Success</Button>
      </div>
    </section>
    
    <section>
      <h2 class="text-xl font-semibold mb-4">组合使用</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button size="lg" variant="primary">Large Primary</Button>
        <Button size="md" variant="secondary">Medium Secondary</Button>
        <Button size="sm" variant="danger">Small Danger</Button>
        <Button size="lg" variant="success" block>Large Success Block</Button>
        <Button size="sm" variant="warning" className="font-bold">Custom Class</Button>
        <Button size="md" variant="info" @click="showAlert">With Click Handler</Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
function showAlert() {
  alert('按钮被点击了！')
}
</script> 