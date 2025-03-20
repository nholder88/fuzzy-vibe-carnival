import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className='bg-blue-800 text-white'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex justify-between items-center'>
          <Link href='/' className='text-xl font-bold'>
            Home Organization System
          </Link>

          <div className='space-x-6'>
            <Link href='/' className='hover:text-blue-200'>
              Dashboard
            </Link>
            <Link href='/chores' className='hover:text-blue-200'>
              Chores
            </Link>
            <Link href='/inventory' className='hover:text-blue-200'>
              Inventory
            </Link>
            <Link href='/shopping-list' className='hover:text-blue-200'>
              Shopping List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
