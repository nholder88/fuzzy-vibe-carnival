'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SkeletonTest() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='h1 mb-6'>Skeleton UI Test Page</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <section>
          <h2 className='h2 mb-4'>Buttons</h2>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap gap-2'>
              <Button>Default</Button>
              <Button variant='destructive'>Destructive</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='link'>Link</Button>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button size='sm'>Small</Button>
              <Button size='default'>Default</Button>
              <Button size='lg'>Large</Button>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button size='icon'>🔍</Button>
              <Button size='icon'>🔄</Button>
              <Button size='icon'>➕</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className='h2 mb-4'>Cards</h2>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Card content goes here. This is a standard card layout using
                Skeleton UI.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <div className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Another Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is another example card with different content.</p>
              </CardContent>
              <CardFooter>
                <div className='flex gap-2'>
                  <Button variant='outline'>Cancel</Button>
                  <Button>Submit</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>

      <section className='mt-8'>
        <h2 className='h2 mb-4'>Form Elements</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='card p-4'>
            <h3 className='h3 mb-4'>Inputs</h3>
            <div className='flex flex-col gap-4'>
              <div>
                <label htmlFor='text-input' className='label'>
                  Text Input
                </label>
                <Input id='text-input' placeholder='Enter some text' />
              </div>

              <div>
                <label htmlFor='email-input' className='label'>
                  Email Input
                </label>
                <Input
                  id='email-input'
                  type='email'
                  placeholder='email@example.com'
                />
              </div>

              <div>
                <label htmlFor='password-input' className='label'>
                  Password Input
                </label>
                <Input
                  id='password-input'
                  type='password'
                  placeholder='Password'
                />
              </div>
            </div>
          </div>

          <div className='card p-4'>
            <h3 className='h3 mb-4'>Native Form Elements</h3>
            <div className='flex flex-col gap-4'>
              <div>
                <label htmlFor='native-input' className='label'>
                  Native Input
                </label>
                <input
                  id='native-input'
                  className='input'
                  placeholder='Native input with Skeleton class'
                />
              </div>

              <div>
                <label htmlFor='native-textarea' className='label'>
                  Textarea
                </label>
                <textarea
                  id='native-textarea'
                  className='textarea'
                  placeholder='Native textarea with Skeleton class'
                ></textarea>
              </div>

              <div>
                <label className='label'>Checkbox</label>
                <div className='flex items-center gap-2'>
                  <input className='checkbox' type='checkbox' checked />
                  <span>Skeleton UI Checkbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mt-8'>
        <h2 className='h2 mb-4'>Tabs</h2>
        <Card className='p-4'>
          <Tabs defaultValue='account' className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger value='account' className='flex-1'>
                Account
              </TabsTrigger>
              <TabsTrigger value='password' className='flex-1'>
                Password
              </TabsTrigger>
              <TabsTrigger value='settings' className='flex-1'>
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value='account' className='p-4'>
              <h3 className='h3 mb-2'>Account</h3>
              <p>Manage your account settings and preferences.</p>
            </TabsContent>
            <TabsContent value='password' className='p-4'>
              <h3 className='h3 mb-2'>Password</h3>
              <p>
                Change your password here. After saving, you'll be logged out.
              </p>
            </TabsContent>
            <TabsContent value='settings' className='p-4'>
              <h3 className='h3 mb-2'>Settings</h3>
              <p>Configure your application settings and preferences.</p>
            </TabsContent>
          </Tabs>
        </Card>
      </section>

      <section className='mt-8'>
        <h2 className='h2 mb-4'>Native Skeleton Classes</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='card p-4'>
            <h3 className='h3'>Card with Native Classes</h3>
            <p>This card uses Skeleton's native classes directly.</p>
            <div className='card-footer'>
              <button className='btn preset-filled'>Button</button>
            </div>
          </div>

          <div className='card variant-filled-primary p-4'>
            <h3 className='h3 text-white'>Filled Card</h3>
            <p>This card uses variant-filled-primary class.</p>
          </div>

          <div className='card variant-ghost p-4'>
            <h3 className='h3'>Ghost Card</h3>
            <p>This card uses variant-ghost class.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
