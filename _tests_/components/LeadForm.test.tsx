import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadForm from "@/components/LeadForm";
import { useStore } from "@/store/useStore";

// mock Zustand store
jest.mock("@/store/useStore");

describe("LeadForm", () => {
  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      addLead: jest.fn(),
    });
  });

  it("renders input fields", () => {
    render(<LeadForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("submits form successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: { _id: "1" } }),
      })
    ) as jest.Mock;

    render(<LeadForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /add lead/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/leads",
        expect.any(Object)
      );
    });
  });
});
