import React from 'react';
import { ThemeProvider } from 'next-themes';

export const ThemeDecorator = (Story: React.ComponentType) => (
  <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
    <div className='min-h-screen p-4 bg-background text-foreground'>
      <Story />
    </div>
  </ThemeProvider>
);
