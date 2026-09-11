import EndpointDot from "@/app/components/EndpointDot";

export default function EndpointForStep({
  step,
}: {
  step: number;
}) {
  if (step === 1) {
    return (
      <EndpointDot label="Profile API" />
    );
  }

  if (step === 2) {
    return (
      <EndpointDot label="Social Context API" />
    );
  }

  return (
    <EndpointDot label="Create Elder Agent" />
  );
}
