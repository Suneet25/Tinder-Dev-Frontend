import { Link } from "react-router-dom";
import { Button, EmptyState } from "../components/common";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center">
      <EmptyState
        icon="compass"
        title="Page not found"
        description="That page doesn't exist."
        action={
          <Button as={Link} to="/feed">
            Back to Discover
          </Button>
        }
      />
    </div>
  );
}
