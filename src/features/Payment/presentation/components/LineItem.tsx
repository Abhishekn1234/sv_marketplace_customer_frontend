export function LineItem({
  label,
  value,
  isTotal = false,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
}) {
  return (
    <div
      style={{
        display:        "flex",
        justifyContent: "space-between",
        fontSize:       13,
        color:          isTotal ? "#312E81" : "#6366F1",
        fontWeight:     isTotal ? 600 : 400,
        paddingTop:     isTotal ? 10 : 0,
        borderTop:      isTotal ? "0.5px solid rgba(99,102,241,0.15)" : "none",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}