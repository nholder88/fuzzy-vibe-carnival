export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm'>
        <h1 className='text-4xl font-bold text-center mb-8'>
          Home Organization System
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Chore Management</h2>
            <p className='text-gray-600'>
              Track and manage household chores with ease.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Inventory Tracking</h2>
            <p className='text-gray-600'>
              Keep track of household items and get low stock alerts.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Shopping Lists</h2>
            <p className='text-gray-600'>
              Generate and manage shopping lists automatically.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold mb-4'>
              Household Management
            </h2>
            <p className='text-gray-600'>
              Manage household members and their roles.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
