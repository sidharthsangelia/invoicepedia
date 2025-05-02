"use client";
  import Container from "./Container";
 
  
  function Footer() {
    return (
      <footer className="mt-12 mb-8">
        <Container className="flex justify-between gap-4">
         <p className="text-sm">
            Invocipedia &copy; {new Date().getFullYear()}
         </p>
         <p className="text-sm">
            Create by Sidharth Sangelia with Next.js , Xata and Clerk
         </p>
        </Container>
      </footer>
    );
  }
  
  export default Footer;
  