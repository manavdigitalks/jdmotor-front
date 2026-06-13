"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

interface Inspection {
  _id: string;
  vehicle_details?: {
    company_name?: string;
    car_name?: string;
    model_year?: number;
    fuel_type?: string;
  };
  car_summary_ownership?: {
    overall_rating?: number;
    estimated_value?: number | null;
    car_image?: string;
  };
}

interface ApiResponse {
  data: {
    docs: Inspection[];
    totalDocs: number;
    totalPages: number;
    page: number;
  };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/v1/api", "") ||
  "http://localhost:5001";

const getRatingColor = (r?: number) => {
  if (!r) return { bg: "#f1f5f9", text: "#94a3b8" };
  if (r >= 4.0) return { bg: "#dcfce7", text: "#16a34a" };
  if (r >= 3.0) return { bg: "#fef3c7", text: "#d97706" };
  return { bg: "#fee2e2", text: "#dc2626" };
};

export default function AllDataPage() {
  const [data, setData] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const router = useRouter();

  const fetchData = async (p: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/car-inspections?page=${p}&limit=10`);
      const responseData =
        res.data?.data?.docs ??
        res.data?.docs ??
        res.data?.data ??
        res.data ??
        [];

      setData(Array.isArray(responseData) ? responseData : []);
      setTotalPages(res.data?.data?.totalPages ?? res.data?.totalPages ?? 1);
      setTotalDocs(res.data?.data?.totalDocs ?? res.data?.totalDocs ?? 0);
    } catch (e) {
      console.error(e);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchData(page);
}, [page]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#1e3a5f",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🚗</span>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              Ride X
            </div>
            <div style={{ fontSize: 10, color: "#93c5fd" }}>BY CARS24</div>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + New Inspection
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {/* Title */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1e293b",
                margin: 0,
              }}
            >
              All Inspections
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              Total {totalDocs} inspections found
            </p>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 80px 1fr 1fr 100px 100px 120px 110px",
              background: "#1e3a5f",
              padding: "12px 20px",
              gap: 12,
            }}
          >
            {[
              "#",
              "Image",
              "Car Name",
              "Company",
              "Year",
              "Fuel",
              "Rating",
              "Action",
            ].map((h, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#93c5fd",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div
              style={{
                padding: "48px 20px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              Loading inspections...
            </div>
          ) : data.length === 0 ? (
            <div
              style={{
                padding: "48px 20px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              No inspections found.
            </div>
          ) : (
            data.map((item, idx) => {
              const v = item.vehicle_details;
              const s = item.car_summary_ownership;
              const rating = s?.overall_rating;
              const ratingStyle = getRatingColor(rating);
              const imgUrl = s?.car_image ? `${BASE_URL}${s.car_image}` : null;

              return (
                <div
                  key={item._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "60px 80px 1fr 1fr 100px 100px 120px 110px",
                    padding: "14px 20px",
                    gap: 12,
                    alignItems: "center",
                    borderBottom: "1px solid #f1f5f9",
                    background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#fff" : "#f8fafc")
                  }
                >
                  {/* # */}
                  <div
                    style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}
                  >
                    {(page - 1) * 10 + idx + 1}
                  </div>

                  {/* Image */}
                  <div
                    style={{
                      width: 56,
                      height: 40,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {imgUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgUrl}
                        alt="car"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "🚗"
                    )}
                  </div>

                  {/* Car Name */}
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}
                  >
                    {v?.car_name || "—"}
                  </div>

                  {/* Company */}
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    {v?.company_name || "—"}
                  </div>

                  {/* Year */}
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    {v?.model_year || "—"}
                  </div>

                  {/* Fuel */}
                  <div>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {v?.fuel_type || "—"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div>
                    {rating ? (
                      <span
                        style={{
                          background: ratingStyle.bg,
                          color: ratingStyle.text,
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: 6,
                        }}
                      >
                        ⭐ {rating}/5
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                    )}
                  </div>

                  {/* Action */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => router.push(`/view/${item._id}`)}
                      style={{
                        background: "#1e3a5f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/?edit=${item._id}`)}
                      style={{
                        background: "#f97316",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                background: page === 1 ? "#f1f5f9" : "#1e3a5f",
                color: page === 1 ? "#94a3b8" : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: 13,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  background: page === p ? "#f97316" : "#fff",
                  color: page === p ? "#fff" : "#475569",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                background: page === totalPages ? "#f1f5f9" : "#1e3a5f",
                color: page === totalPages ? "#94a3b8" : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: 13,
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
