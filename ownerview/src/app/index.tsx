import { Redirect } from 'expo-router';

/** The app's home is the case list; the lock gate sits above it in _layout. */
export default function Index() {
  return <Redirect href="/cases" />;
}
