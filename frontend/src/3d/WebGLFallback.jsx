export default function WebGLFallback({ src, alt = 'Product', children }) {
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden bg-cognify-card">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cognify-card to-cognify-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-cognify-bg/70 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-xs tracking-widest uppercase text-cognify-gray">
        3D preview unavailable
      </div>
      {children}
    </div>
  );
}
