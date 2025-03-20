interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <svg
        className='w-24 h-24 text-gray-400 mb-4'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='8' y1='15' x2='16' y2='15' />
        <line x1='9' y1='9' x2='9.01' y2='9' />
        <line x1='15' y1='9' x2='15.01' y2='9' />
        <path d='M10 9a4 4 0 0 0 4 0' />
        <path d='M7 8l1 1' />
        <path d='M16 8l-1 1' />
      </svg>
      <p className='text-xl text-gray-600'>{message}</p>
    </div>
  );
}
