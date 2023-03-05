
---
title: Required
linktitle: Required
type: book
commentable: true
---

# Required

```ts
interface ContactForm {
  email?: string;
  message?: string;
}

function submitContactForm(formData: Required<ContactForm>) {
  // Send the form data to the server.
}

submitContactForm({
  email: "ex@mple.com",
  message: "Hi! Could you tell me more about…",
});

// TypeScript error: missing property 'message'
submitContactForm({
  email: "ex@mple.com",
});
```

    