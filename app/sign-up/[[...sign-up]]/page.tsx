import Container from "@/components/Container";
import { SignUp } from "@clerk/nextjs";


function page() {
  return (
    <Container className="flex justify-center">
      <SignUp />
    </Container>
  );
}

export default page;
