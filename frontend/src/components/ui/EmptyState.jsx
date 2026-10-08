import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 border border-cognify-border flex items-center justify-center mb-6">
          <Icon size={28} className="text-cognify-gray" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-cognify-white mb-2">{title}</h3>
      <p className="text-cognify-gray text-sm max-w-sm mb-8">{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
