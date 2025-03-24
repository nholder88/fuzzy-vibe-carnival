import ActivityFeed from '../components/activity-feed';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col'>
      <div className='z-10 w-full'>
        <h1 className='text-4xl font-bold mb-8'>Home Organization System</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Welcome!</h2>
              <p className='text-gray-600 mb-4'>
                Track and manage your household tasks, inventory, and shopping
                lists all in one place.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                <div className='bg-blue-50 p-4 rounded-md'>
                  <h3 className='font-medium text-blue-700 mb-2'>
                    Quick Stats
                  </h3>
                  <p>5 chores due today</p>
                  <p>3 inventory items low</p>
                </div>

                <div className='bg-green-50 p-4 rounded-md'>
                  <h3 className='font-medium text-green-700 mb-2'>Tips</h3>
                  <p>Set up recurring chores for regular tasks</p>
                  <p>Add family members to share responsibilities</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold mb-4'>Chore Management</h2>
                <p className='text-gray-600'>
                  Track and manage household chores with ease.
                </p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Inventory Tracking
                </h2>
                <p className='text-gray-600'>
                  Keep track of household items and get low stock alerts.
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </main>
  );
}
