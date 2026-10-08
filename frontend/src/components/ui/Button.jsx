import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-cognify-offwhite text-cognify-bg hover:bg-white',
  secondary: 'border border-cognify-offwhite text-cognify-offwhite hover:bg-cognify-offwhite hover:text-cognify-bg',
  ghost: 'text-cognify-gray hover:text-cognify-white',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  olive: 'bg-cognify-olive text-white hover:bg-cognify-olive/90',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', className = '', loading = false, disabled = false, ...props },
  ref
) {
  const base = 'font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
});

export default Button;
