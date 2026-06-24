
export const formatDateforsecurity=(t:any)=>[
new Date().toLocaleDateString(
    t.securitypage.locale || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
]
