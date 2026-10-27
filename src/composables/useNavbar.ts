import { computed, readonly, shallowRef } from 'vue'

const navActive = shallowRef(false)
const isCollapsed = shallowRef(false)

export function useNavbar() {
  const navStyles = computed(() => {
    return navActive.value ? 'navbar-active' : ''
  })

  const toggleMenu = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const closeMenu = () => {
    isCollapsed.value = false
  }

  const setNavActive = (active: boolean) => {
    navActive.value = active
  }

  return {
    navActive: readonly(navActive),
    isCollapsed: readonly(isCollapsed),
    navStyles,
    toggleMenu,
    closeMenu,
    setNavActive,
  }
}
