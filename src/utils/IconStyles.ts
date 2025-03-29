/**
 * Common icon sizes for consistency across the application
 * Lucide icons take a size prop instead of using className for sizing
 */

export const IconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };
  
  /**
   * Helper function to get common props for Lucide icons
   */
  export const getIconProps = (size: keyof typeof IconSizes, className?: string) => {
    return {
      size: IconSizes[size],
      className: className || '',
      strokeWidth: 2,
    };
  };
  
  // Usage example:
  // <PlayIcon {...getIconProps('md', 'text-white')} />