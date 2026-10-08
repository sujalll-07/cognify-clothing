export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 border-2 border-cognify-border border-t-cognify-olive rounded-full animate-spin" />
      <p className="text-cognify-gray text-sm tracking-wider">{message}</p>
    </div>
  );
}
