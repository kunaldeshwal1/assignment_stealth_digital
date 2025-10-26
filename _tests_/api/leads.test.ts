import { POST, GET } from "@/app/api/leads/route";
import Lead from "@/models/Lead";
import { NextRequest } from "next/server";

// ✅ Mock mongoose and the things it imports
jest.mock("mongoose");
jest.mock("@/lib/db", () => ({
  connectDB: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/lib/auth", () => ({
  getUserFromRequest: jest.fn(() => ({
    userId: "123",
    email: "test@x.com",
    role: "user",
  })),
}));

describe("Leads API", () => {
  describe("POST /api/leads", () => {
    it("creates a new lead", async () => {
      const mockLead = {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        status: "new",
        userId: "123",
      };
      (Lead.create as jest.Mock).mockResolvedValue(mockLead);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("John Doe");
    });
  });

  describe("GET /api/leads", () => {
    it("fetches all leads", async () => {
      const mockLeads = [
        { _id: "1", name: "Lead 1", email: "lead1@example.com", status: "new" },
        {
          _id: "2",
          name: "Lead 2",
          email: "lead2@example.com",
          status: "contacted",
        },
      ];

      (Lead.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockLeads),
      });

      const request = new NextRequest("http://localhost:3000/api/leads");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
    });
  });
});
