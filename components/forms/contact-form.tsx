"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must contain at least 3 characters.",
  }),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, {
    message: "Please write something more descriptive.",
  }),
  social: z.string().url().optional().or(z.literal("")),
});

export function ContactForm() {
  const storeModal = useModalStore();

  // const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      social: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      form.reset();

      if (response.status === 200) {
        storeModal.onOpen({
          title: "Thank you!",
          description:
            "Your message has been received! I appreciate your contact and will get back to you shortly.",
          icon: Icons.successAnimated,
        });
      }
    } catch (err) {
      console.log("Err!", err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">Name</FormLabel>
              <FormControl>
                <Input placeholder="What should I call you?" className="h-12 rounded-none border-0 border-b border-ink/20 bg-transparent px-0 text-[18px] placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
              </FormControl>
              {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">Email</FormLabel>
              <FormControl>
                <Input placeholder="Where can I reply?" className="h-12 rounded-none border-0 border-b border-ink/20 bg-transparent px-0 text-[18px] placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">The problem</FormLabel>
              <FormControl>
                <Textarea placeholder="What are you building, and what is in the way?" className="min-h-[140px] rounded-none border-0 border-b border-ink/20 bg-transparent px-0 text-[18px] placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your site, LinkedIn or X" className="h-12 rounded-none border-0 border-b border-ink/20 bg-transparent px-0 text-[18px] placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
              </FormControl>
              {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-auto rounded-none bg-ember px-6 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ash hover:bg-ink"
        >
          {form.formState.isSubmitting ? "Sending…" : "Send it →"}
        </Button>
      </form>
    </Form>
  );
}
