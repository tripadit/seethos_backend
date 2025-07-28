import loadable from '@loadable/component';
import { Loader2 } from 'lucide-react';

const LazyImport = (importComponent: any) => {
  const AppComponent = loadable(importComponent, {
    fallback: (
      <div className="h-[80vh] w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    ),
  });

  return <AppComponent />;
};

export default LazyImport;
