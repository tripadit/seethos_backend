import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAddDomain } from '../../hooks/hooks';

export default function StepOneComponent({ onNext }: { onNext: (domain: any) => void }) {
  const addDomain = useAddDomain();

  const [domain, setDomain] = useState<string>('');

  const [error, setError] = useState<string>('');

  const next = async (event: any) => {
    event.preventDefault();
    if (!domain) {
      setError('Domain is required');
      return;
    }
    if (/^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/i.test(domain) === false) {
      setError('Invalid domain');
      return;
    }
    const data = await addDomain.mutateAsync({ domain });

    if (data) {
      onNext(data);
    }
  };

  return (
    <form onSubmit={next}>
      <div className="mb-2">Enter your domain name</div>
      <Input
        placeholder="eg. sub-domain.yourdomain.com"
        value={domain}
        onChange={(event) => {
          setError('');
          setDomain(event.target.value);
        }}
      />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex w-full mt-4 justify-end">
        <Button className="" variant="purple" type="submit" isLoading={addDomain.isLoading}>
          Next
        </Button>
      </div>
    </form>
  );
}
