import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'
import clsx from 'clsx'
import './tailwind.css'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'

import type { LoaderFunctionArgs } from '@remix-run/node'
import { themeSessionResolver } from './sessions.server'

export async function loader ({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  return {
    theme: getTheme()
  }
}

export function App () {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()

  return (
    <html lang='en' className={clsx(theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function AppWithProviders () {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction='/action/set-theme'>
      <App />
    </ThemeProvider>
  )
}
