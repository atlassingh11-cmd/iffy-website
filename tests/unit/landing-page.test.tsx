import type { ImgHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdviceRoutes } from "@/components/landing/advice-routes";
import { ClientProof } from "@/components/landing/client-proof";
import { TrustLedger } from "@/components/landing/trust-ledger";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...imageProps } = props;
    void fill;
    void priority;
    return (
      // The production component reserves intrinsic geometry through Next Image.
      // eslint-disable-next-line @next/next/no-img-element
      <img {...imageProps} alt={imageProps.alt ?? ""} />
    );
  },
}));

describe("landing narrative", () => {
  it("puts the verified credentials and buyer and seller routes in the static tree", () => {
    render(
      <>
        <TrustLedger />
        <AdviceRoutes />
      </>,
    );

    expect(screen.getByText("Licence 91889")).toBeInTheDocument();
    expect(screen.getByText("ORN 1247700")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Know what you are buying into." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sell with the facts on your side." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Buying advice/ })).toHaveAttribute("href", "/?intent=buying#consultation");
    expect(screen.getByRole("link", { name: /Selling advice/ })).toHaveAttribute("href", "/?intent=selling#consultation");
  });

  it("uses only the existing attributed review excerpt", () => {
    render(<ClientProof />);

    expect(screen.getByText("Oisin W, Home Buyer, Dubai")).toBeInTheDocument();
    expect(screen.getByText(/I never felt any stress or pressure/)).toBeInTheDocument();
  });
});
