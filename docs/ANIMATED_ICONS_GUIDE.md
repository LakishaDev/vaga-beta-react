# Animated Icons - itshover style

## 📦 Setup

Svi animated ikoni su kreirani bazirano na [itshover](https://github.com/itshover/itshover) library patternu, ali prilagođeni našem projektu.

### Dependencies
- ✅ `motion` (framer-motion fork) - Already installed
- ✅ React 19+ - Already available

## 🎨 Available Icons

| Icon | Component | Use Case |
|------|-----------|----------|
| 👤 | `UserIcon` | Single user representation |
| 👥 | `UsersIcon` | Multiple users, user list |
| 🛡️ | `ShieldIcon` | Admin, security, protection |
| 📦 | `PackageIcon` | Products, licenses |
| ➕ | `PlusIcon` | Add new item |
| ✏️ | `EditIcon` | Edit action |
| 🗑️ | `TrashIcon` | Delete action |
| 🔑 | `KeyIcon` | Password, authentication |
| 🔍 | `SearchIcon` | Search functionality |
| 🔽 | `FilterIcon` | Filter, sort |
| ✅ | `CheckIcon` | Success, confirm |
| ❌ | `XCloseIcon` | Close, cancel |
| ⚠️ | `AlertCircleIcon` | Warnings, alerts |
| ⚙️ | `SettingsIcon` | Settings, configuration |
| 🍔 | `MenuIcon` | Mobile menu |

## 🚀 Usage

### Basic Usage

```jsx
import { UserIcon } from '@/components/icons';

function MyComponent() {
  return (
    <UserIcon className="w-6 h-6 text-blue-500" />
  );
}
```

### With Hover Animation

Ikone automatski animiraju na hover:

```jsx
<UserIcon 
  className="w-8 h-8 text-gray-700 hover:text-blue-500 transition-colors cursor-pointer"
/>
```

### Custom Size & Color

```jsx
// Small
<PlusIcon className="w-4 h-4" />

// Medium (default)
<EditIcon className="w-6 h-6" />

// Large
<SettingsIcon className="w-8 h-8" />

// With color
<ShieldIcon className="w-6 h-6 text-green-500" />
```

### In Buttons

```jsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
  <PlusIcon className="w-5 h-5" />
  Add User
</button>
```

### Programmatic Animation

```jsx
import { UserIcon } from '@/components/icons';
import { useRef } from 'react';

function MyComponent() {
  const iconRef = useRef(null);
  
  const triggerAnimation = () => {
    // Trigger hover animation programmatically
    if (iconRef.current) {
      iconRef.current.dispatchEvent(new Event('mouseenter'));
    }
  };
  
  return <UserIcon ref={iconRef} className="w-6 h-6" />;
}
```

## 🎭 Animation Details

Svaka ikona ima svoju jedinstvenu animaciju:

- **UserIcon**: Circle scales up on hover
- **UsersIcon**: Groups separate and scale
- **ShieldIcon**: Shield scales + checkmark appears
- **PackageIcon**: 3D rotation effect
- **PlusIcon**: Lines extend
- **EditIcon**: Pen moves up-right
- **TrashIcon**: Trash moves down, lines shrink
- **KeyIcon**: Key rotates slightly
- **SearchIcon**: Magnifying glass scales + handle extends
- **FilterIcon**: Filter lifts up
- **CheckIcon**: Checkmark scales
- **XCloseIcon**: Lines rotate 90°
- **AlertCircleIcon**: Circle pulses + dot scales
- **SettingsIcon**: Gear rotates 90°
- **MenuIcon**: Lines shift

## 🎨 Customization

### Change Animation Speed

```jsx
<UserIcon 
  className="w-6 h-6"
  transition={{ duration: 0.5 }} // Slower
/>
```

### Change Animation Type

Modifikuj direktno u icon komponenti:

```jsx
// user-icon.jsx
transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
```

### Add Custom Variants

```jsx
<UserIcon 
  className="w-6 h-6"
  variants={{
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: 10 }, // Custom hover
  }}
/>
```

## 📱 Responsive Sizing

```jsx
<UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
```

## ♿ Accessibility

Za screen readers:

```jsx
<button aria-label="Edit user">
  <EditIcon className="w-5 h-5" />
</button>
```

## 🎯 Best Practices

1. **Consistent sizing**: Use Tailwind classes (w-4, w-5, w-6, w-8)
2. **Color inheritance**: Icons inherit `currentColor` by default
3. **Hover feedback**: Combine with color transitions
4. **Loading states**: Disable hover during loading
5. **Touch targets**: Min 44x44px for mobile (use padding on button)

## 🔧 Troubleshooting

### Animation not working?
- Check that `motion` is installed: `npm list motion`
- Verify `whileHover="hover"` is present
- Ensure parent doesn't have `pointer-events: none`

### Icon not visible?
- Check stroke color (default is `currentColor`)
- Verify className includes color: `text-gray-700`
- Check parent's CSS might be hiding it

### Performance issues?
- Reduce number of animated icons on screen
- Use `will-change: transform` for frequently animated icons
- Consider lazy loading icons below the fold

## 📚 Resources

- [itshover GitHub](https://github.com/itshover/itshover)
- [itshover Website](https://itshover.com)
- [Motion (framer-motion fork)](https://motion.dev)

---

**Version**: 1.0.0  
**Created**: 2026-01-05  
**Icons**: 15 animated components
