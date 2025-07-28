import Required from '@/components/molecules/Required';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ICallToAction {
  form: any;
  botDetail: any;
  mode?: string | null;
}

export const CallToAction = ({ form }: ICallToAction) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Agent Role */}
      <div className="flex flex-col gap-6 ">
        <FormField
          control={form.control}
          name="agent_role"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[170px_1fr]">
              <FormLabel className="min-w-170">
                Agent Role
                <Required />
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SALES">Sales</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="CUSTOMER SERVICE">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* CTA Link */}
      <div className="flex flex-col gap-6 mt-4">
        <FormField
          control={form.control}
          name="call_to_action_link"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[170px_1fr]">
              <FormLabel className="min-w-170">
                CTA Link
                <Required />
              </FormLabel>
              <FormControl>
                <Input defaultValue="" placeholder="https://www.demo.ai" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
