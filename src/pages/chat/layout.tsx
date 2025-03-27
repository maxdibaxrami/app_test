
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <section 
        style={{
          height:`100%`,
          transition: 'height 0.3s ease',
          display: 'flex',
          position:"relative",
          flexDirection: 'column',
          overflow:"hidden",
        }}
        >            
      {children}
    </section>
  );
}