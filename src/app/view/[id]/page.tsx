"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInspectionById } from "../../../../lib/inspectionApi";

// ─── ALL STATIC PARAM LISTS ──────────────────────────────────────────────
const PARAMS_LIST = [
  "Boot Floor",
  "Pillar LHS A",
  "Pillar LHS B",
  "Pillar LHS C",
  "Pillar RHS A",
  "Pillar RHS B",
  "Pillar RHS C",
  "Apron LHS",
  "Apron RHS",
  "Apron RHS LEG",
  "Apron LHS LEG",
  "Firewall",
  "Cowl Top",
  "Upper Cross Member",
  "Front Show",
  "Lower Cross Member",
  "Radiator Support",
  "Head Light Support",
  "Windshield Rear",
  "Light LHS Taillight",
  "Light LHS Fog Light",
  "Light RHS Fog Light",
  "ORVM LHS",
  "Tyre / Spare Tyre",
  "Grill",
  "Is Car Waterlogged",
  "Roof",
  "Bonnet / Hood",
  "Dicky Door / Boot Door",
  "Quarter Panel LHS",
  "Quarter Panel RHS",
  "Fender LHS",
  "Fender RHS",
  "Running Border LHS",
  "Running Border RHS",
  "Door LHS Front",
  "Door LHS Rear",
  "Door RHS Front",
  "Door RHS Rear",
  "Windshield Front",
  "Light LHS Headlight",
  "Light RHS Headlight",
  "Light RHS Taillight",
  "Bumper Front",
  "Bumper Rear",
  "ORVM RHS",
  "Alloy Wheel",
  "LHS Front Tyre",
  "LHS Rear Tyre",
  "RHS Front Tyre",
  "RHS Rear Tyre",
];

const ENGINE_PARAMS_LIST = [
  "Engine",
  "Engine Sound",
  "Exhaust Smoke",
  "Engine Permissible Blow-by",
  "Clutch",
  "Gear Shifting",
  "Engine Oil Level Dipstick",
  "Battery",
  "Coolant",
  "Sump",
  "Engine Oil",
];

const ELECTRICAL_PARAMS_LIST = [
  "4 Power Windows",
  "Airbag Feature",
  "Music System",
  "Leather Seat",
  "Sunroof",
  "Steering Mounted Audio Control",
  "ABS",
  "Rear Defogger",
  "Reverse Camera",
  "Electrical",
  "Interior",
  "Parking Sensor",
];

const STEERING_PARAMS_LIST = ["Steering", "Suspension", "Brake"];

const AC_PARAMS_LIST = ["AC Cooling", "Heater", "Climate Control AC"];

const OTHER_PARAMS_LIST = [
  "Chassis Embossing",
  "RC Availability",
  "Insurance Image",
  "Duplicate Key",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────
const s = (obj: React.CSSProperties): React.CSSProperties => obj;

const getRatingColor = (r: string) => {
  const n = parseFloat(r);
  if (!r || isNaN(n)) return "#64748b";
  if (n >= 4.0) return "#16a34a";
  if (n >= 3.0) return "#d97706";
  return "#dc2626";
};
const getRatingBg = (r: string) => {
  const n = parseFloat(r);
  if (!r || isNaN(n)) return "#f1f5f9";
  if (n >= 4.0) return "#dcfce7";
  if (n >= 3.0) return "#fef3c7";
  return "#fee2e2";
};

const CheckIcon = () => (
  <span style={{ color: "#16a34a", fontSize: 17, fontWeight: 700 }}>✓</span>
);
const BadIcon = () => (
  <span
    style={s({
      background: "#ef4444",
      color: "#fff",
      borderRadius: "50%",
      width: 20,
      height: 20,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
    })}
  >
    !
  </span>
);

// ─── SHARED UI ────────────────────────────────────────────────────────────
const LogoHeader = () => (
  <div style={s({ display: "flex", alignItems: "center", gap: 8 })}>
    <div
      style={s({
        background: "#1e3a5f",
        borderRadius: 8,
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 6,
      })}
    >
      <span style={{ fontSize: 15 }}>🚗</span>
      <div>
        <div
          style={s({
            fontSize: 12,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: 1,
          })}
        >
          CAR TRUTH
        </div>
        <div style={s({ fontSize: 8, color: "#93c5fd" })}>BY CARS24</div>
      </div>
    </div>
  </div>
);

const ReportPage = ({
  children,
  pageNum,
  total = 18,
  showCategoryNav = false,
}: {
  children: React.ReactNode;
  pageNum: number;
  total?: number;
  showCategoryNav?: boolean;
}) => (
  <div
    className="report-page"
    style={s({
      width: 794,
      minHeight: 1123,
      background: "#fff",
      margin: "0 auto 24px",
      padding: "28px 40px 50px",
      boxSizing: "border-box",
      position: "relative",
      fontFamily: "'Segoe UI', sans-serif",
      boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
    })}
  >
    {/* Header */}
    <div
      style={s({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: 10,
        marginBottom: 18,
      })}
    >
      <LogoHeader />
      <span style={s({ fontSize: 11, color: "#64748b" })}>
        🔒 Advanced report
      </span>
    </div>
    {/* Category Nav */}
    {showCategoryNav && (
      <div
        style={s({
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          marginBottom: 16,
          fontSize: 10,
        })}
      >
        {[
          "Exterior & Tyres",
          "Engine & Transmission",
          "Electricals & Interiors",
          "Steering, Suspension & Brakes",
          "Air Condition",
          "Other Details",
        ].map((c, i) => (
          <span
            key={i}
            style={s({
              background: "#f1f5f9",
              padding: "3px 7px",
              borderRadius: 4,
              color: "#475569",
              fontWeight: 500,
            })}
          >
            {c}
          </span>
        ))}
      </div>
    )}
    {children}
    {/* Footer */}
    <div
      style={s({
        position: "absolute",
        bottom: 14,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 9,
        color: "#94a3b8",
        borderTop: "1px solid #f1f5f9",
        paddingTop: 6,
      })}
    >
      <span>
        {pageNum}/{total}
      </span>
    </div>
  </div>
);

const toDbKey = (label: string) =>
  label.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

const Dash = () => <span style={{ color: "#94a3b8", fontSize: 15 }}>—</span>;

const ParamsTable = ({
  staticList,
  data,
  type = "pi",
}: {
  staticList: string[];
  data: Record<string, string>;
  type?: "pi" | "av";
}) => {
  const col1Val = type === "av" ? "available" : "perfect";
  const col2Val = type === "av" ? "notavailable" : "imperfect";
  const col1Lbl = type === "av" ? "Available" : "Perfect";
  const col2Lbl = type === "av" ? "Not Available" : "Imperfect";

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
        marginBottom: 6,
      }}
    >
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th
            style={{
              textAlign: "left",
              padding: "8px 12px",
              fontWeight: 600,
              color: "#374151",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            Parameters
          </th>
          <th
            style={{
              textAlign: "center",
              padding: "8px 12px",
              fontWeight: 600,
              color: "#374151",
              borderBottom: "1px solid #e2e8f0",
              width: 110,
            }}
          >
            {col1Lbl}
          </th>
          <th
            style={{
              textAlign: "center",
              padding: "8px 12px",
              fontWeight: 600,
              color: "#374151",
              borderBottom: "1px solid #e2e8f0",
              width: 110,
            }}
          >
            {col2Lbl}
          </th>
        </tr>
      </thead>
      <tbody>
        {staticList.map((label, i) => {
          const key = toDbKey(label);
          const prefixedKey =
            data[`eng_${key}`] !== undefined
              ? `eng_${key}`
              : data[`elec_${key}`] !== undefined
                ? `elec_${key}`
                : data[`str_${key}`] !== undefined
                  ? `str_${key}`
                  : data[`ac_${key}`] !== undefined
                    ? `ac_${key}`
                    : data[`oth_${key}`] !== undefined
                      ? `oth_${key}`
                      : key;
          const val = data[prefixedKey] ?? "";
          const isCol1 = val === col1Val;
          const isCol2 = val === col2Val;
          return (
            <tr
              key={label}
              style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
            >
              <td
                style={{
                  padding: "8px 12px",
                  color: "#475569",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {label}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "8px 12px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {isCol1 ? <CheckIcon /> : <Dash />}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "8px 12px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {isCol2 ? <BadIcon /> : <Dash />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CategoryBlock = ({
  number,
  title,
  perfect,
  imperfect,
  cost,
  staticList,
  data,
  type = "pi",
}: {
  number: string;
  title: string;
  perfect: number;
  imperfect: number;
  cost?: string;
  staticList: string[];
  data: Record<string, string>;
  type?: "pi" | "av";
}) => (
  <div
    style={{
      marginBottom: 20,
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      overflow: "hidden",
    }}
  >
    <div style={{ background: "#1e3a5f", color: "#fff", padding: "12px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>
        {number}. {title}
      </div>
      <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>
        Perfect parts: {perfect} | Imperfect parts: {imperfect}
        {cost ? ` | Estimated repair cost: ₹${cost}` : ""}
      </div>
    </div>
    <ParamsTable staticList={staticList} data={data} type={type} />
  </div>
);

const OemTable = ({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={s({
        fontSize: 14,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 8,
      })}
    >
      {title}
    </div>
    <table
      style={s({
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        overflow: "hidden",
      })}
    >
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th
            style={s({
              textAlign: "left",
              padding: "8px 12px",
              fontWeight: 600,
              color: "#374151",
              fontSize: 12,
            })}
          >
            Parameters
          </th>
          <th
            style={s({
              textAlign: "right",
              padding: "8px 12px",
              fontWeight: 600,
              color: "#374151",
              fontSize: 12,
            })}
          >
            Metric
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
            <td
              style={s({
                padding: "8px 12px",
                color: "#475569",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 12,
              })}
            >
              {r.label}
            </td>
            <td
              style={s({
                padding: "8px 12px",
                fontWeight: 600,
                color: "#1e293b",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 12,
                textAlign: "right",
              })}
            >
              {r.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ImgBox = ({
  url,
  label,
  height = 150,
  showPlaceholder = false,
}: {
  url: string;
  label: string;
  height?: number;
  showPlaceholder?: boolean; // ← new prop
}) => {
  if (!url && !showPlaceholder) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          style={{
            width: "100%",
            height,
            objectFit: "cover",
            borderRadius: 6,
            display: "block",
          }}
        />
      ) : (
        // Grey placeholder — user image nahi add kari hoy to
        <div
          style={{
            width: "100%",
            height,
            background: "#f1f5f9",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px dashed #cbd5e1",
            gap: 6,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
            No image
          </span>
        </div>
      )}
      {/* Label — sirf tyare show karo jyare label hoy (empty string nahi) */}
      {label && label.trim() && (
        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
          {label}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
export default function ReportViewPage() {
  const { id } = useParams();
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getInspectionById(id as string)
      .then((data) => setD(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: 18,
        }}
      >
        Loading report...
      </div>
    );

  if (!d)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>Report not found.</div>
    );

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/v1/api", "") || "";

  const r = {
    companyName: d.vehicle_details?.company_name ?? "",
    carName: d.vehicle_details?.car_name ?? "",
    variantName: d.vehicle_details?.variant ?? "",
    modal: String(d.vehicle_details?.model_year ?? ""),
    type: d.vehicle_details?.type ?? "",
    fuelType: d.vehicle_details?.fuel_type ?? "",
    cityName: d.vehicle_details?.city ?? "",
    reportDate: d.vehicle_details?.inspection_date?.split("T")[0] ?? "",
    Inspected_by: d.vehicle_details?.inspected_by ?? "",
    overallRating: String(d.car_summary_ownership?.overall_rating ?? ""),
    ratingTitle: d.car_summary_ownership?.rating_title ?? "",
    odometer_km: String(d.car_summary_ownership?.odometer ?? ""),
    estimateValue: String(d.car_summary_ownership?.estimated_value ?? ""),
    ownershipNo: String(d.car_summary_ownership?.ownership_no ?? ""),
    healthSummary: d.car_summary_ownership?.summary ?? "",
    ownerName: d.car_summary_ownership?.owner_name ?? "",
    ownershipType: d.car_summary_ownership?.ownership_type ?? "",
    regDate: d.car_summary_ownership?.registration_date?.split("T")[0] ?? "",
    regPlace: d.car_summary_ownership?.registration_place ?? "",
    fitnessValidity:
      d.car_summary_ownership?.fitness_validity?.split("T")[0] ?? "",
    puccValidity: d.car_summary_ownership?.pucc_validity?.split("T")[0] ?? "",
    blacklisted: d.car_summary_ownership?.blacklisted ?? "No",
    car_image: d.car_summary_ownership?.car_image
      ? `${BASE_URL}${d.car_summary_ownership.car_image}`
      : "",
    rtoNocDate:
      d.transferability_legal?.rto_noc_issue_date?.split("T")[0] ?? "",
    partyPeshi: d.transferability_legal?.party_peshi_applicability ?? "",
    hypothecation: d.transferability_legal?.hypothecation ?? "",
    financierName: d.transferability_legal?.financier_name ?? "",
    modConverted: d.transferability_legal?.converted ?? "",
    modMigration: d.transferability_legal?.migration ?? "",
    modAdapter: d.transferability_legal?.adapted_for_special_use ?? "",
    criminalCases: String(d.transferability_legal?.criminal_case ?? "0"),
    civilCases: String(d.transferability_legal?.civil_case ?? "0"),
    roadAccidents: String(d.transferability_legal?.road_accidents ?? "0"),
    theftCases: String(d.transferability_legal?.theft_cases ?? "0"),
    compensationCases: String(
      d.transferability_legal?.compensation_case ?? "0",
    ),
    otherCases: String(d.transferability_legal?.other_case ?? "0"),
    tyresRating: String(d.category_ratings?.tyre_rating ?? ""),
    tyresRatingTitle: d.category_ratings?.tyre_rating_title ?? "",
    engineRating: String(d.category_ratings?.engine_rating ?? ""),
    engineRatingTitle: d.category_ratings?.engine_rating_title ?? "",
    steeringRating: String(d.category_ratings?.steering_rating ?? ""),
    steeringRatingTitle: d.category_ratings?.steering_rating_title ?? "",
    acRating: String(d.category_ratings?.ac_rating ?? ""),
    acRatingTitle: d.category_ratings?.ac_rating_title ?? "",
    electricalsRating: String(d.category_ratings?.electrics_rating ?? ""),
    electricalsRatingTitle: d.category_ratings?.electrics_rating_title ?? "",
    repair_cost: String(d.exterior_tyres_inspection?.cost ?? "0"),
    params: (d.exterior_tyres_inspection?.subsection_parameters ??
      {}) as Record<string, string>,
    engine_repair_cost: String(
      d.engine_transmission_electrical_suspension?.engine_repair_cost ?? "0",
    ),
    steering_repair_cost: String(
      d.engine_transmission_electrical_suspension?.steering_repair_cost ?? "0",
    ),
    totalAirbags: String(
      d.engine_transmission_electrical_suspension?.total_airbags ?? "",
    ),
    totalPowerWindows: String(
      d.engine_transmission_electrical_suspension?.total_power_windows ?? "",
    ),

    // eng_params: (d.engine_transmission_electrical_suspension?.engine_params ??
    //   {}) as Record<string, string>,
    eng_params: Object.fromEntries(
      Object.entries(d.section_7?.subsection_engine_transmission ?? {}).map(
        ([k, v]) => {
          // reverse the special-case rename done in buildSection7
          const key = k === "engine_oil_level" ? "engine_oil_level_dipstick" : k;
          return [`eng_${key}`, v];
        },
      ),
    ) as Record<string, string>,
    // elec_params: (d.engine_transmission_electrical_suspension
    //   ?.electrical_params ?? {}) as Record<string, string>,
    elec_params: Object.fromEntries(
      Object.entries(d.section_7?.subsection_electricals_interiors ?? {}).map(
        ([k, v]) => [
          k === "power_windows_4" ? "elec_4_power_windows" : `elec_${k}`,
          v,
        ],
      ),
    ) as Record<string, string>,
    // str_params: (d.engine_transmission_electrical_suspension?.steering_params ??
    //   {}) as Record<string, string>,
    str_params: Object.fromEntries(
      Object.entries(
        d.section_7?.subsection_steering_suspension_brakes ?? {},
      ).map(([k, v]) => [`str_${k}`, v]),
    ) as Record<string, string>,
    // ac_params: (d.engine_transmission_electrical_suspension?.ac_params ??
    //   {}) as Record<string, string>,
    ac_params: Object.fromEntries(
      Object.entries(d.section_7?.subsection_air_condition ?? {}).map(
        ([k, v]) => [`ac_${k}`, v],
      ),
    ) as Record<string, string>,
    // oth_params: (d.engine_transmission_electrical_suspension?.other_params ??
    //   {}) as Record<string, string>,
    oth_params: Object.fromEntries(
      Object.entries(d.section_7?.subsection_other_details ?? {}).map(
        ([k, v]) => [`oth_${k}`, v],
      ),
    ) as Record<string, string>,

    vehicle_images: ((d.section_5_images ?? []) as string[]).map((url, i) => ({
      url: url ? `${BASE_URL}${url}` : "",
      label: `Image ${i + 1}`,
    })),
    other_images: ((d.other_images ?? []) as { image_url: string }[]).map(
      (img) => (img.image_url ? `${BASE_URL}${img.image_url}` : ""),
    ),
    other_image_titles: ((d.other_images ?? []) as { title: string }[]).map(
      (img) => img.title ?? "",
    ),
    photo_grid: (
      (d.other_images ?? []) as { image_url: string; title: string }[]
    ).map((img) => ({
      url: img.image_url ? `${BASE_URL}${img.image_url}` : "",
      label: img.title ?? "",
    })),
    // OEM fields — from oem_feature_space (backend model field names)
    oem_power_window: d.oem_feature_space?.power_window ?? "",
    oem_airbags_count: String(d.oem_feature_space?.airbags ?? ""),
    oem_seating_capacity: String(d.oem_feature_space?.seating_capacity ?? ""),
    oem_front_fog_lights: d.oem_feature_space?.front_fog_lights ?? "",
    oem_isofix: d.oem_feature_space?.isofix_child_anchor ?? "",
    oem_abs: d.oem_feature_space?.abs ?? "",
    oem_central_locking: d.oem_feature_space?.center_locking ?? "",
    oem_rear_defogger: d.oem_feature_space?.rear_defogger ?? "",
    oem_airbags_safety: String(d.oem_feature_space?.airbags_count ?? ""),
    oem_max_power_bhp: String(d.oem_feature_space?.max_power_bhp ?? ""),
    oem_max_torque_nm: String(d.oem_feature_space?.max_torque ?? ""),
    oem_fuel_tank_lit: String(d.oem_feature_space?.fuel_tank_capacity ?? ""),
    oem_emission_standard: d.oem_feature_space?.emission_standard ?? "",
    oem_instrument_panel: d.oem_feature_space?.instrument_panel_type ?? "",
    oem_360_camera: d.oem_feature_space?.camera_360 ?? "",
    oem_speaker_brand: d.oem_feature_space?.speaker_brand ?? "",
    oem_no_of_speakers: String(d.oem_feature_space?.no_of_speaker ?? ""),
    oem_infotainment: d.oem_feature_space?.infotainment_system ?? "",
    oem_gps: d.oem_feature_space?.gps ?? "",
    oem_steering_audio_ctrl: d.oem_feature_space?.steering_audio_controls ?? "",
    oem_smart_connectivity: d.oem_feature_space?.smart_connectivity ?? "",
    oem_display_screen_size: String(d.oem_feature_space?.display_screen_size ?? ""),
    oem_multi_display_size: String(d.oem_feature_space?.multi_function_in_display ?? ""),
    oem_body_type: d.oem_feature_space?.body_type ?? "",
    oem_seating_rows: String(d.oem_feature_space?.no_of_seating_rows ?? ""),
    oem_bootspace_lit: String(d.oem_feature_space?.bootspace ?? ""),
    oem_width_mm: String(d.oem_feature_space?.width ?? ""),
    oem_gearbox_gears: String(d.oem_feature_space?.gearbox ?? ""),
    oem_displacement_cc: String(d.oem_feature_space?.displacement ?? ""),
    oem_transmission_type: d.oem_feature_space?.transmission_type ?? "",
    oem_cylinders: String(d.oem_feature_space?.cylinders ?? ""),
    oem_brake_rear: d.oem_feature_space?.brake_type_rear ?? "",
    oem_brake_front: d.oem_feature_space?.brake_type_front ?? "",
    oem_disc_brakes: String(d.oem_feature_space?.no_of_disc_brake ?? ""),
    oem_seat_upholstery: d.oem_feature_space?.seat_upholstery ?? "",
    oem_auto_climate: d.oem_feature_space?.auto_climate_control ?? "",
    oem_wireless_charging: d.oem_feature_space?.wireless_charging_pad ?? "",
    oem_steering_material: d.oem_feature_space?.steering_wheel_material ?? "",
    oem_smart_key: d.oem_feature_space?.smart_card ?? "",
    oem_top_model: d.oem_feature_space?.top_model ?? "",
    oem_parking_sensors: d.oem_feature_space?.parking_sensor ?? "",
    oem_rear_ac: d.oem_feature_space?.rear_ac ?? "",
    oem_power_windows_pos: d.oem_feature_space?.power_windows ?? "",
    oem_steering_adjust: d.oem_feature_space?.steering_adjustment ?? "",
    oem_driver_seat_adjust: d.oem_feature_space?.driver_seat_adjustment ?? "",
    oem_cruise_control: d.oem_feature_space?.cruise_control ?? "",
    oem_air_conditioner: d.oem_feature_space?.air_conditioner ?? "",
    oem_push_button_start: d.oem_feature_space?.push_button_start ?? "",
    oem_ovrm: "",
    oem_elec_fold_mirrors: "",
    oem_wheels: "",
    oem_remote_trunk: "",
    oem_drl: "",
    oem_auto_headlamps: "",
    oem_sunroof: "",
    oem_rear_wiper: "",
    challan_pending_count: 0,
    challan_pending_amount: "₹0",
    challan_history: [] as {
      year: string;
      total: number;
      pending: number;
      entries: {
        date: string;
        offence: string;
        challan_no: string;
        amount: string;
        status: string;
      }[];
    }[],
  };

  const cnt = (obj: Record<string, string>, val: string) =>
    Object.values(obj).filter((v) => v === val).length;

  const extP = cnt(r.params, "perfect"),
    extI = cnt(r.params, "imperfect");
  const engP = cnt(r.eng_params, "perfect"),
    engI = cnt(r.eng_params, "imperfect");
  const elecP = cnt(r.elec_params, "perfect"),
    elecI = cnt(r.elec_params, "imperfect");
  const strP = cnt(r.str_params, "perfect"),
    strI = cnt(r.str_params, "imperfect");
  const acP = cnt(r.ac_params, "perfect"),
    acI = cnt(r.ac_params, "imperfect");
  const othA = cnt(r.oth_params, "available"),
    othN = cnt(r.oth_params, "not-available");
  const totalImperfect = extI + engI + strI;
  const totalCost =
    parseInt(r.repair_cost) +
    parseInt(r.engine_repair_cost) +
    parseInt(r.steering_repair_cost);

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        body{background:#dde2ea;margin:0;padding:20px 0;}
        @media print{
          body{background:#fff;padding:0;margin:0;}
          .no-print{display:none!important;}
          .report-page{
            width: 794px !important;
            height: 1123px !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            padding: 28px 40px 50px !important;
            page-break-after: always;
            break-after: page;
          }
          .report-page:last-child{page-break-after:avoid;break-after:avoid;}
          @page{size:A4;margin:0;}
        }
        .pbtn{position:fixed;top:18px;right:18px;background:#1e3a5f;color:#fff;border:none;
          padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;
          display:flex;align-items:center;gap:7px;z-index:1000;
          box-shadow:0 4px 12px rgba(30,58,95,.4);transition:transform .15s;}
        .pbtn:hover{transform:translateY(-1px);}
      `}</style>

      <button className="pbtn no-print" onClick={() => window.print()}>
        🖨️ Print / Save PDF
      </button>

      {/* ══ PAGE 1 — COVER ══════════════════════════════════════════════ */}
      <ReportPage pageNum={1}>
        <div
          style={s({
            background: "linear-gradient(135deg,#e8f4fd,#dbeafe)",
            borderRadius: 16,
            padding: "36px 40px",
            marginBottom: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <div>
            <p style={s({ fontSize: 15, color: "#64748b", margin: "0 0 2px" })}>
              Comprehensive
            </p>
            <h1
              style={s({
                fontSize: 30,
                fontWeight: 800,
                color: "#1e3a5f",
                margin: "0 0 26px",
                lineHeight: 1.1,
              })}
            >
              Car Inspection
              <br />
              Report
            </h1>
            {[
              {
                icon: "🚗",
                light: "Thorough inspection with",
                bold: "300+ quality checks",
              },
              {
                icon: "📋",
                light: "Precise insights from",
                bold: "experienced technicians",
              },
              {
                icon: "✅",
                light: "Trusted by",
                bold: "over 600,000 customers",
              },
            ].map((x, i) => (
              <div
                key={i}
                style={s({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                })}
              >
                <div
                  style={s({
                    background: "#fff",
                    borderRadius: 8,
                    padding: 7,
                    fontSize: 17,
                  })}
                >
                  {x.icon}
                </div>
                <div>
                  <div style={s({ fontSize: 10, color: "#64748b" })}>
                    {x.light}
                  </div>
                  <div
                    style={s({
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1e293b",
                    })}
                  >
                    {x.bold}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={s({
              width: 130,
              height: 130,
              background: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
            })}
          >
            🚙
          </div>
        </div>
        <div
          style={s({
            border: "2px solid #1e3a5f",
            borderRadius: 8,
            padding: "8px 14px",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 600,
            color: "#1e3a5f",
          })}
        >
          🇮🇳 IN ** ** ******
        </div>
        <div style={s({ display: "flex", gap: 20, alignItems: "flex-start" })}>
          <div style={{ flex: 1 }}>
            <h2
              style={s({
                fontSize: 20,
                fontWeight: 800,
                color: "#f97316",
                margin: "0 0 4px",
              })}
            >
              {r.carName}
            </h2>
            <p
              style={s({ fontSize: 12, color: "#64748b", margin: "0 0 10px" })}
            >
              {r.variantName} | {r.modal} | {r.type} | {r.fuelType}
            </p>
            <p style={s({ fontSize: 12, color: "#475569", margin: "0 0 4px" })}>
              Inspection location: {r.cityName}
            </p>
            <p style={s({ fontSize: 12, color: "#475569", margin: 0 })}>
              Report generated on: <strong>{r.reportDate}</strong>
            </p>
          </div>
          <div
            style={s({
              border: "2px solid #22c55e",
              borderRadius: 10,
              padding: "10px 18px",
              textAlign: "center",
              minWidth: 155,
            })}
          >
            <div
              style={s({
                fontSize: 10,
                fontWeight: 700,
                color: "#22c55e",
                letterSpacing: 1,
                marginBottom: 7,
              })}
            >
              CARS24 TRUST
            </div>
            <div
              style={s({ display: "flex", gap: 14, justifyContent: "center" })}
            >
              {[
                { v: "10M+", l: "Cars Inspected" },
                { v: "200+", l: "Cities Present" },
                { v: "1M+", l: "Cars Sold" },
              ].map((x, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={s({
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#1e293b",
                    })}
                  >
                    {x.v}
                  </div>
                  <div style={s({ fontSize: 9, color: "#64748b" })}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReportPage>

      {/* ══ PAGE 2 — TABLE OF CONTENTS ══════════════════════════════════ */}
      <ReportPage pageNum={2}>
        <h1
          style={s({
            fontSize: 26,
            fontWeight: 800,
            color: "#f97316",
            marginBottom: 22,
          })}
        >
          Content of report
        </h1>
        {[
          {
            num: "01",
            title: "Your report at a glace",
            desc: "Overview of your overall car condition",
            icon: "🚗",
          },
          {
            num: "02",
            title: "Inspection summary",
            desc: "Category wise ratings and condition",
            icon: "📋",
          },
          {
            num: "03",
            title: "Detailed Evaluation of each category",
            desc: "1. Exterior & Tyres\n2. Engine & Transmission\n3. Steering, Suspension & Brakes\n4. Air Conditioning\n5. Electricals & Interiors\n6. Other Details",
            icon: "⚙️",
          },
          {
            num: "04",
            title: "OEM installed features & specs",
            desc: "1. Safety\n2. Fuel & Performance\n3. Entertainment & Communication\n4. Dimensions & Capacity\n5. Engine, Transmission & Brakes\n6. Comfort & Convenience",
            icon: "💺",
          },
        ].map((x, i) => (
          <div
            key={i}
            style={s({
              border: "1.5px solid #dbeafe",
              borderRadius: 12,
              padding: "16px 18px",
              marginBottom: 12,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            })}
          >
            <span
              style={s({
                fontSize: 26,
                fontWeight: 800,
                color: "#dbeafe",
                minWidth: 38,
              })}
            >
              {x.num}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={s({
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 3,
                })}
              >
                {x.title}
              </div>
              <div
                style={s({
                  fontSize: 11,
                  color: "#64748b",
                  whiteSpace: "pre-line",
                })}
              >
                {x.desc}
              </div>
            </div>
            <span style={{ fontSize: 26 }}>{x.icon}</span>
          </div>
        ))}
      </ReportPage>

      {/* ══ PAGE 3 — REPORT AT A GLANCE ════════════════════════════════ */}
      <ReportPage pageNum={3}>
        {/* Car card */}
        <div
          style={s({
            border: "1.5px solid #e2e8f0",
            borderRadius: 12,
            padding: 18,
            display: "flex",
            gap: 20,
            marginBottom: 18,
          })}
        >
          <div
            style={s({
              width: 240,
              height: 160,
              background: "#f1f5f9",
              borderRadius: 8,
              flexShrink: 0,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            })}
          >
            {r.car_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.car_image} alt="Car" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "🚗"
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={s({
                fontSize: 18,
                fontWeight: 800,
                color: "#1e293b",
                margin: "0 0 3px",
              })}
            >
              {r.carName}
            </h2>
            <p
              style={s({ fontSize: 11, color: "#64748b", margin: "0 0 12px" })}
            >
              {r.variantName} | {r.modal} | {r.type} | {r.fuelType}
            </p>
            <div
              style={s({
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              })}
            >
              <span style={s({ fontSize: 11, color: "#64748b" })}>
                Overall Rating
              </span>
              <span
                style={s({
                  background: getRatingBg(r.overallRating),
                  color: getRatingColor(r.overallRating),
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 17,
                  fontWeight: 800,
                })}
              >
                {r.overallRating}/5
              </span>
              <span
                style={s({
                  color: getRatingColor(r.overallRating),
                  fontWeight: 700,
                  fontSize: 14,
                })}
              >
                {r.ratingTitle}
              </span>
            </div>
            <div style={s({ display: "flex", gap: 18, marginBottom: 12 })}>
              <div>
                <div style={s({ fontSize: 10, color: "#64748b" })}>
                  Odometer reading
                </div>
                <div
                  style={s({ fontSize: 15, fontWeight: 800, color: "#1e293b" })}
                >
                  {r.odometer_km} kms
                </div>
              </div>
              <div>
                <div style={s({ fontSize: 10, color: "#64748b" })}>
                  Estimated Value
                </div>
                <div
                  style={s({ fontSize: 15, fontWeight: 800, color: "#1e293b" })}
                >
                  {r.estimateValue}
                </div>
              </div>
            </div>
            <div
              style={s({
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1.5px solid #fca5a5",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 11,
                color: "#dc2626",
                fontWeight: 600,
              })}
            >
              📄 {r.challan_pending_count} Challans Pending
            </div>
          </div>
        </div>
        {/* Info cards */}
        <div style={s({ display: "flex", gap: 10, marginBottom: 18 })}>
          {[
            { icon: "👤", label: "Ownership no.", value: r.ownershipNo },
            { icon: "🚫", label: "Blacklisted", value: r.blacklisted },
            { icon: "🔧", label: "Fitness validity", value: r.fitnessValidity },
          ].map((x, i) => (
            <div
              key={i}
              style={s({
                flex: 1,
                background: "#1e3a5f",
                color: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              })}
            >
              <span style={{ fontSize: 20 }}>{x.icon}</span>
              <div>
                <div
                  style={s({ fontSize: 10, color: "#93c5fd", marginBottom: 2 })}
                >
                  {x.label}
                </div>
                <div style={s({ fontSize: 14, fontWeight: 700 })}>
                  {x.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Health summary */}
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          })}
        >
          <span style={{ fontSize: 18 }}>🚗</span>
          <h2
            style={s({
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Health report summary
          </h2>
        </div>
        <div
          style={s({
            background: "#f8fafc",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 18,
            fontSize: 12,
            color: "#475569",
            lineHeight: 1.6,
          })}
        >
          <p style={s({ margin: "0 0 8px" })}>
            At CARS24, we inspect cars thoroughly across 140 parameters,
            ensuring the highest quality. Your car has been inspected and is
            non-accidental, non-flooded, and non-tampered.
          </p>
          <p style={s({ margin: 0, whiteSpace: "pre-line" })}>
            {r.healthSummary
              .split(". ")
              .filter(Boolean)
              .map((s2: string) => `• ${s2.trim()}.`)
              .join("\n")}
          </p>
        </div>
        {/* Ownership */}
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          })}
        >
          <span style={{ fontSize: 18 }}>👤</span>
          <h2
            style={s({
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Ownership and fitness
          </h2>
        </div>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            overflow: "hidden",
          })}
        >
          {[
            ["Owner", r.ownerName],
            ["Registration date", r.regDate],
            ["Ownership number", "1"],
            ["Registration place", r.regPlace],
            ["Ownership type", r.ownershipType],
            ["Fitness validity", r.fitnessValidity],
            ["Estimated kms/year", "6,666 kms"],
            ["PUCC validity", r.puccValidity],
          ].map(([l, v], i) => (
            <div
              key={i}
              style={s({
                padding: "9px 12px",
                borderBottom: i < 6 ? "1px solid #f1f5f9" : "none",
                borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none",
                fontSize: 12,
              })}
            >
              <div style={s({ color: "#64748b", marginBottom: 2 })}>{l}</div>
              <div style={s({ fontWeight: 700, color: "#1e293b" })}>{v}</div>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 4 — LEGAL / TRANSFERABILITY ═══════════════════════════ */}
      <ReportPage pageNum={4}>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          })}
        >
          <span style={{ fontSize: 18 }}>👤</span>
          <h2
            style={s({
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Transferability details
          </h2>
        </div>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 20,
          })}
        >
          {[
            ["Blacklisted", "No"],
            ["RTO NOC Issued", r.rtoNocDate],
            ["Party Peshi Applicability", r.partyPeshi],
            [
              "Hypothecation & Financier Name",
              r.hypothecation + " & " + r.financierName,
            ],
          ].map(([l, v], i) => (
            <div
              key={i}
              style={s({
                padding: "9px 12px",
                borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none",
                fontSize: 12,
              })}
            >
              <div style={s({ color: "#64748b", marginBottom: 2 })}>{l}</div>
              <div style={s({ fontWeight: 700, color: "#1e293b" })}>{v}</div>
            </div>
          ))}
        </div>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          })}
        >
          <span style={{ fontSize: 18 }}>🔧</span>
          <h2
            style={s({
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Vehicle modification
          </h2>
        </div>
        <div
          style={s({
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 20,
          })}
        >
          {[
            ["Converted (Commercial ownership to private)", r.modConverted],
            ["Migration (Re-registered in another state)", r.modMigration],
            [
              "Adapted for Special Use (Example differently abled)",
              d.modAdapter,
            ],
          ].map(([l, v], i) => (
            <div
              key={i}
              style={s({
                padding: "9px 12px",
                borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                fontSize: 12,
              })}
            >
              <span style={s({ color: "#64748b" })}>{l}: </span>
              <strong style={s({ color: "#1e293b" })}>{v}</strong>
            </div>
          ))}
        </div>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          })}
        >
          <span style={{ fontSize: 18 }}>⚖️</span>
          <h2
            style={s({
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Legal history details
          </h2>
        </div>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          })}
        >
          {[
            ["Criminal cases", r.criminalCases, true],
            ["Civil cases", r.civilCases, true],
            ["Road accidents", r.roadAccidents, false],
            ["Theft cases", r.theftCases, false],
            ["Compensation cases", r.compensationCases, false],
            ["Other cases", r.otherCases, false],
          ].map(([l, v, alert], i) => (
            <div
              key={i}
              style={s({
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              })}
            >
              <span style={s({ color: "#475569" })}>{l}</span>
              <strong
                style={s({
                  color:
                    alert && parseInt(v as string) > 0 ? "#dc2626" : "#1e293b",
                })}
              >
                {v}
                {alert && parseInt(v as string) > 0 ? " ⚠️" : ""}
              </strong>
            </div>
          ))}
        </div>
        {/* <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          })}
        >
          {[
            {
              title: "⚠️ Criminal case",
              rows: [
                ["Accident date", "16 June, 2023"],
                ["Filing date", "15 June, 2023"],
                ["Place", "New Delhi, Delhi"],
                ["Violation", "Minor Traffic Violation"],
                ["Legal position", "Accused"],
                ["FIR number", "FIR123/2023"],
                ["FIR summary", "Signal jumping incident"],
                ["Acts/Sections", "IPC, Section 279"],
              ],
            },
            {
              title: "⚠️ Civil case: Disposed",
              rows: [
                ["Filing date", "1 July, 2023"],
                ["Disposed date", "1 December, 2023"],
                ["Place", "New Delhi, Delhi"],
                ["Violation", "Contract dispute"],
                ["Legal position", "Respondent"],
                ["CNR number", "CNR123/2023"],
                ["Disposal summary", "Settled by mutual agreement"],
                ["Order judgement", "Case disposed with mutual settlement"],
              ],
            },
          ].map((card, i) => (
            <div
              key={i}
              style={s({
                border: "1.5px solid #fca5a5",
                borderRadius: 10,
                padding: 12,
              })}
            >
              <div
                style={s({
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: 12,
                  marginBottom: 8,
                })}
              >
                {card.title}
              </div>
              {card.rows.map(([k, v], j) => (
                <div
                  key={j}
                  style={s({ fontSize: 11, color: "#475569", marginBottom: 3 })}
                >
                  <strong>{k}:</strong> {v}
                </div>
              ))}
            </div>
          ))}
        </div> */}
      </ReportPage>

      {/* ══ PAGE 5 — CHALLAN HISTORY ════════════════════════════════════ */}
      {/* <ReportPage pageNum={5}>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          })}
        >
          <span style={{ fontSize: 18 }}>📋</span>
          <h2
            style={s({
              fontSize: 18,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Challan history
          </h2>
        </div>
       
        <div
          style={s({
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          })}
        >
          <span style={s({ fontSize: 13, color: "#dc2626", fontWeight: 600 })}>
            ⚠️ Total {r.challan_pending_count} pending challans worth{" "}
            {r.challan_pending_amount}
          </span>
          <span
            style={s({
              fontSize: 12,
              color: "#f97316",
              fontWeight: 700,
              cursor: "pointer",
            })}
          >
            Pay now →
          </span>
        </div>
        {r.challan_history.map((grp, gi) => (
          <div key={gi} style={s({ marginBottom: 22 })}>
            
            <div
              style={s({
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              })}
            >
              <div
                style={s({
                  border: "1px solid #cbd5e1",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                })}
              >
                {grp.year}
              </div>
              <span
                style={s({
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                })}
              >
                ℹ Total challans: {grp.total}
              </span>
              {grp.pending > 0 && (
                <span
                  style={s({
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 20,
                  })}
                >
                  ⚠️ Pending: {grp.pending}
                </span>
              )}
            </div>
            <table
              style={s({
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              })}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Date", "Offence", "Challan no.", "Amount", "Status"].map(
                    (h, i) => (
                      <th
                        key={i}
                        style={s({
                          textAlign: "left",
                          padding: "8px 10px",
                          fontWeight: 600,
                          color: "#374151",
                          borderBottom: "1px solid #e2e8f0",
                        })}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {grp.entries.map((e, ei) => {
                  const statusColor =
                    e.status === "Paid"
                      ? "#16a34a"
                      : e.status === "Pending"
                        ? "#dc2626"
                        : "#d97706";
                  return (
                    <tr
                      key={ei}
                      style={{ background: ei % 2 === 0 ? "#fff" : "#f8fafc" }}
                    >
                      <td
                        style={s({
                          padding: "8px 10px",
                          color: "#475569",
                          borderBottom: "1px solid #f1f5f9",
                        })}
                      >
                        {e.date}
                      </td>
                      <td
                        style={s({
                          padding: "8px 10px",
                          color: "#475569",
                          borderBottom: "1px solid #f1f5f9",
                          maxWidth: 220,
                        })}
                      >
                        {e.offence}
                      </td>
                      <td
                        style={s({
                          padding: "8px 10px",
                          color: "#475569",
                          borderBottom: "1px solid #f1f5f9",
                        })}
                      >
                        {e.challan_no}
                      </td>
                      <td
                        style={s({
                          padding: "8px 10px",
                          color: "#475569",
                          borderBottom: "1px solid #f1f5f9",
                        })}
                      >
                        {e.amount}
                      </td>
                      <td
                        style={s({
                          padding: "8px 10px",
                          borderBottom: "1px solid #f1f5f9",
                          fontWeight: 600,
                          color: statusColor,
                        })}
                      >
                        {e.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </ReportPage> */}

      {/* ══ PAGE 6 — INSPECTION SUMMARY ════════════════════════════════ */}
      <ReportPage pageNum={6}>
        <div
          style={s({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          })}
        >
          <h1
            style={s({
              fontSize: 22,
              fontWeight: 800,
              color: "#1e293b",
              margin: 0,
            })}
          >
            ✨ Inspection summary
          </h1>
          <div
            style={s({
              background:
                "repeating-linear-gradient(45deg,#f97316,#f97316 4px,transparent 4px,transparent 10px)",
              width: 70,
              height: 7,
              borderRadius: 4,
            })}
          />
        </div>
        <p style={s({ fontSize: 12, color: "#64748b", marginBottom: 22 })}>
          This section provides a comprehensive evaluation of the most recent
          car assessment, meticulously divided into five key categories to offer
          an in-depth and accurate overview.
        </p>
        {[
          {
            icon: "🔧",
            title: "Exterior & Tyres",
            desc: "The exterior of the car has scratches and some parts have been repainted. The tyres have a tread depth of 3-5mm.",
            rating: r.tyresRating,
            rt: r.tyresRatingTitle,
          },
          {
            icon: "⚙️",
            title: "Engine & Transmission",
            desc: "The engine is in good condition. There are no issues with blow-by, engine sound, or exhaust smoke. However, the engine oil is dirty.",
            rating: r.engineRating,
            rt: r.engineRatingTitle,
          },
          {
            icon: "🎯",
            title: "Steering, Suspension & Brakes",
            desc: "Your car's steering, suspension, and brakes are all in good condition. There are no issues that need immediate attention.",
            rating: r.steeringRating,
            rt: r.steeringRatingTitle,
          },
          {
            icon: "❄️",
            title: "Air Conditioning",
            desc: "The air conditioning in your car is working perfectly. The AC, heater, and climate control are all functional.",
            rating: r.acRating,
            rt: r.acRatingTitle,
          },
          {
            icon: "💡",
            title: "Electricals & Interiors",
            desc: "Your car has all the electrical features working well, including power windows, airbags, music system, and a reverse camera. The interior is in good condition with leather seats and a sunroof.",
            rating: r.electricalsRating,
            rt: r.electricalsRatingTitle,
          },
        ].map((x, i) => (
          <div
            key={i}
            style={s({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "16px 0",
              borderBottom: "1px solid #f1f5f9",
              gap: 18,
            })}
          >
            <div style={{ flex: 1 }}>
              <div
                style={s({
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 5,
                })}
              >
                {x.icon} {x.title}
              </div>
              <div
                style={s({ fontSize: 12, color: "#64748b", lineHeight: 1.5 })}
              >
                {x.desc}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={s({
                  fontSize: 22,
                  fontWeight: 800,
                  color: getRatingColor(x.rating),
                })}
              >
                {x.rating}/5
              </div>
              <div
                style={s({
                  fontSize: 11,
                  fontWeight: 600,
                  color: getRatingColor(x.rating),
                })}
              >
                {x.rt}
              </div>
            </div>
          </div>
        ))}
      </ReportPage>

      {/* ══ PAGE 7 — VEHICLE IMAGES ═════════════════════════════════════ */}
      <ReportPage pageNum={7}>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          })}
        >
          <span style={{ fontSize: 18 }}>👁️</span>
          <h2
            style={s({
              fontSize: 18,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Vehicle images
          </h2>
          <div
            style={s({
              marginLeft: "auto",
              background:
                "repeating-linear-gradient(45deg,#f97316,#f97316 4px,transparent 4px,transparent 10px)",
              width: 70,
              height: 7,
              borderRadius: 4,
            })}
          />
        </div>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          })}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <ImgBox
              key={i}
              url={r.vehicle_images[i]?.url || ""}
              label={r.vehicle_images[i]?.label || `Image ${i + 1}`}
              height={155}
              showPlaceholder={true}
            />
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 8 — EXTERIOR & TYRES PARAMS ═══════════════════════════ */}
      <ReportPage pageNum={8} showCategoryNav>
        <CategoryBlock
          number="01"
          title="Exterior & Tyres"
          perfect={extP}
          imperfect={extI}
          cost={r.repair_cost}
          staticList={PARAMS_LIST}
          data={r.params}
        />
      </ReportPage>

      {/* ══ PAGE 9 — Engine & Transmission ════════════ */}
      <ReportPage pageNum={9} showCategoryNav>
        {r.photo_grid.slice(16).some((x) => x.url) && (
          <>
            <div
              style={s({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              })}
            >
              {r.photo_grid.slice(16).map((x, i) => (
                <ImgBox key={i} url={x.url} label={x.label} height={145} />
              ))}
            </div>
            <div
              style={s({
                textAlign: "center",
                margin: "16px 0",
                fontSize: 20,
                color: "#22c55e",
              })}
            >
              ✓
            </div>
          </>
        )}
        <CategoryBlock
          number="02"
          title="Engine & Transmission"
          perfect={engP}
          imperfect={engI}
          cost={r.engine_repair_cost}
          staticList={ENGINE_PARAMS_LIST}
          data={r.eng_params}
        />
      </ReportPage>

      {/* ══ PAGE 10 — ELECTRICALS + STEERING + AC + OTHER ═══════════════ */}
      <ReportPage pageNum={10} showCategoryNav>
        <CategoryBlock
          number="03"
          title="Electricals & Interiors"
          perfect={elecP}
          imperfect={elecI}
          staticList={ELECTRICAL_PARAMS_LIST}
          data={r.elec_params}
        />
        {/* Airbags / Power windows count */}
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          })}
        >
          <div
            style={s({
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
            })}
          >
            <span style={s({ color: "#64748b" })}>No. Of Airbags: </span>
            <strong>{r.totalAirbags}</strong>
          </div>
          <div
            style={s({
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
            })}
          >
            <span style={s({ color: "#64748b" })}>No. Of Power Windows: </span>
            <strong>{r.totalPowerWindows}</strong>
          </div>
        </div>
        <div
          style={s({
            textAlign: "center",
            margin: "6px 0 14px",
            fontSize: 20,
            color: "#22c55e",
          })}
        >
          ✓
        </div>
        <CategoryBlock
          number="04"
          title="Steering, Suspension & Brakes"
          perfect={strP}
          imperfect={strI}
          cost={r.steering_repair_cost}
          staticList={STEERING_PARAMS_LIST}
          data={r.str_params}
        />
        <div
          style={s({
            textAlign: "center",
            margin: "6px 0 14px",
            fontSize: 20,
            color: "#22c55e",
          })}
        >
          ✓
        </div>
        <CategoryBlock
          number="05"
          title="Air Conditioning"
          perfect={acP}
          imperfect={acI}
          staticList={AC_PARAMS_LIST}
          data={r.ac_params}
        />
        <CategoryBlock
          number="06"
          title="Other Details"
          perfect={othA}
          imperfect={othN}
          staticList={OTHER_PARAMS_LIST}
          data={r.oth_params}
          type="av"
        />
      </ReportPage>

      {/* ══ PAGE 11 — OTHER IMAGES (25 photos) ════════════════════════ */}
      <ReportPage pageNum={11}>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          })}
        >
          <span style={{ fontSize: 18 }}>🖼️</span>
          <h2
            style={s({
              fontSize: 18,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Other Inspection Images
          </h2>
        </div>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          })}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <ImgBox
              key={i}
              url={r.photo_grid[i]?.url || ""}
              label={r.photo_grid[i]?.label || ""}
              height={145}
              showPlaceholder={true}
            />
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 12 — OTHER IMAGES (9-16) ══════════════════════════════ */}
      <ReportPage pageNum={12}>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          })}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <ImgBox
              key={i}
              url={r.photo_grid[i + 8]?.url || ""}
              label={r.photo_grid[i + 8]?.label || ""}
              height={145}
              showPlaceholder={true}
            />
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 13 — OTHER IMAGES (17-25) ═════════════════════════════ */}
      <ReportPage pageNum={13}>
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          })}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <ImgBox
              key={i}
              url={r.photo_grid[i + 16]?.url || ""}
              label={r.photo_grid[i + 16]?.label || ""}
              height={145}
              showPlaceholder={true}
            />
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 14 — OEM FEATURES (Safety + Fuel) ══════════════════════ */}
      <ReportPage pageNum={14}>
        <h1
          style={s({
            fontSize: 22,
            fontWeight: 800,
            color: "#f97316",
            marginBottom: 6,
          })}
        >
          ✨ OEM installed features &amp; specs
        </h1>
        <p style={s({ fontSize: 12, color: "#64748b", marginBottom: 18 })}>
          Understanding the features and specifications of the{" "}
          <strong>{r.carName}</strong> is essential to ensure it aligns with
          your preferences, needs, and lifestyle.
        </p>
        <div style={s({ display: "flex", gap: 10, marginBottom: 22 })}>
          {[
            { icon: "🪟", label: "Power window", value: r.oem_power_window },
            { icon: "🛡️", label: "Airbags", value: r.oem_airbags_count },
            {
              icon: "💺",
              label: "Seating capacity",
              value: r.oem_seating_capacity,
            },
          ].map((x, i) => (
            <div
              key={i}
              style={s({
                flex: 1,
                background: "#1e3a5f",
                color: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              })}
            >
              <span style={{ fontSize: 22 }}>{x.icon}</span>
              <div>
                <div style={s({ fontSize: 10, color: "#93c5fd" })}>
                  {x.label}
                </div>
                <div style={s({ fontSize: 15, fontWeight: 800 })}>
                  {x.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <OemTable
          title="🛡️ Safety"
          rows={[
            { label: "Front Fog Lights", value: r.oem_front_fog_lights },
            { label: "ISOFIX-Child Seat Anchor Points", value: r.oem_isofix },
            { label: "Anti-lock Braking System (ABS)", value: r.oem_abs },
            { label: "Central Locking", value: r.oem_central_locking },
            { label: "Rear Defogger", value: r.oem_rear_defogger },
            { label: "Airbags", value: r.oem_airbags_safety },
          ]}
        />
        <OemTable
          title="🔥 Fuel & Performance"
          rows={[
            { label: "Max power (bhp)", value: r.oem_max_power_bhp },
            { label: "Max torque (Nm)", value: r.oem_max_torque_nm },
            { label: "Fuel tank capacity (lit)", value: r.oem_fuel_tank_lit },
            { label: "Emission Standard", value: r.oem_emission_standard },
          ]}
        />
      </ReportPage>

      {/* ══ PAGE 15 — ENTERTAINMENT ════════════════════════════════════ */}
      <ReportPage pageNum={15}>
        <OemTable
          title="🎵 Entertainment & Communication"
          rows={[
            { label: "Instrument Panel", value: r.oem_instrument_panel },
            { label: "360 Camera", value: r.oem_360_camera },
            { label: "Speaker Brand", value: r.oem_speaker_brand },
            { label: "No. of Speakers", value: r.oem_no_of_speakers },
            { label: "Infotainment", value: r.oem_infotainment },
            { label: "GPS", value: r.oem_gps },
            {
              label: "Steering Audio Control",
              value: r.oem_steering_audio_ctrl,
            },
            { label: "Smart Connectivity", value: r.oem_smart_connectivity },
            {
              label: "Entertainment Display Screen Size",
              value: r.oem_display_screen_size,
            },
            {
              label: "Multi-function Display Screen Size",
              value: r.oem_multi_display_size,
            },
          ]}
        />

        <OemTable
          title="📐 Dimensions & Capacity"
          rows={[
            { label: "Body Type", value: r.oem_body_type },
            { label: "No Of Seating Rows", value: r.oem_seating_rows },
            { label: "Seating Capacity", value: r.oem_seating_capacity },
            { label: "Bootspace (litres)", value: r.oem_bootspace_lit },
            { label: "Width (mm)", value: r.oem_width_mm },
          ]}
        />

        
      </ReportPage>

      {/* ══ PAGE 16 — DIMENSIONS SVG DIAGRAM + ENGINE TABLE ════════════ */}
      <ReportPage pageNum={16}>
        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          })}
        ></div>

        <OemTable
          title="⚙️ Engine, Transmission & Brakes"
          rows={[
            { label: "Gear Box - No. of Gears", value: r.oem_gearbox_gears },
            { label: "Displacement (cc)", value: r.oem_displacement_cc },
            { label: "Transmission type", value: r.oem_transmission_type },
            { label: "Cylinders", value: r.oem_cylinders },
            { label: "Break type (rear)", value: r.oem_brake_rear },
            { label: "Break type (front)", value: r.oem_brake_front },
            { label: "Number of disc brakes", value: r.oem_disc_brakes },
          ]}
        />


        <div
          style={s({
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          })}
        >
          <span style={{ fontSize: 16 }}>🛋️</span>
          <h3
            style={s({
              fontSize: 15,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            })}
          >
            Comfort &amp; Convenience
          </h3>
        </div>
        <OemTable
          title=""
          rows={[
            { label: "Seat upholstery (cc)", value: r.oem_seat_upholstery },
            { label: "Auto climate control", value: r.oem_auto_climate },
            { label: "Wireless charging pad", value: r.oem_wireless_charging },
            {
              label: "Steering wheel material",
              value: r.oem_steering_material,
            },
            { label: "Smart Card/Smart Key", value: r.oem_smart_key },
            { label: "Top model", value: r.oem_top_model },
          ]}
        />
      </ReportPage>

      {/* ══ PAGE 17 — COMFORT & CONVENIENCE (PDF page 22 style) ════════ */}
      <ReportPage pageNum={17}>
        
        {/* Icon grid — PDF page 22 style */}
        <div
          style={s({
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginTop: 8,
          })}
        >
          {[
            {
              label: "Parking sensors",
              value: r.oem_parking_sensors,
              icon: "📡",
            },
            { label: "Rear AC", value: r.oem_rear_ac, icon: "❄️" },
            {
              label: "Power windows",
              value: r.oem_power_windows_pos,
              icon: "🪟",
            },
            {
              label: "Steering adjustment",
              value: r.oem_steering_adjust,
              icon: "🎡",
            },
            {
              label: "Driver seat adjustment",
              value: r.oem_driver_seat_adjust,
              icon: "💺",
            },
            {
              label: "Cruise control",
              value: r.oem_cruise_control,
              icon: "🛞",
            },
            {
              label: "Air conditioner",
              value: r.oem_air_conditioner,
              icon: "❄️",
            },
            {
              label: "Push button start",
              value: r.oem_push_button_start,
              icon: "🔘",
            },
          ].map((x, i) => (
            <div
              key={i}
              style={s({
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "12px 14px",
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              })}
            >
              <div style={s({ fontSize: 11, color: "#64748b" })}>{x.label}</div>
              <div
                style={s({ fontSize: 16, fontWeight: 800, color: "#1e293b" })}
              >
                {x.value}
              </div>
              <div style={s({ fontSize: 22, marginTop: 4 })}>{x.icon}</div>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ══ PAGE 18 — THANK YOU ══════════════════════════════════════════ */}
      <ReportPage pageNum={18}>
        <div style={s({ textAlign: "center", padding: "36px 20px" })}>
          <h1
            style={s({
              fontSize: 30,
              fontWeight: 800,
              color: "#f97316",
              marginBottom: 18,
            })}
          >
            Thank you for choosing us!
          </h1>
          <p
            style={s({
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.8,
              maxWidth: 480,
              margin: "0 auto 20px",
            })}
          >
            We truly appreciate your decision to prioritize the safety and
            maintenance of your vehicle. By opting for a thorough inspection,
            you&apos;re ensuring not only the longevity of your car but also
            peace of mind for you and your loved ones.
          </p>
          <p
            style={s({
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.8,
              maxWidth: 480,
              margin: "0 auto 28px",
            })}
          >
            Should you have any questions about the inspection report or need
            further assistance, please don&apos;t hesitate to reach out.
            We&apos;re here to help and ensure your vehicle remains in top
            condition. Thank you once again for your trust and patronage.
          </p>
          {/* Ratings */}
          <div
            style={s({
              background: "#f0f9ff",
              borderRadius: 12,
              padding: "20px 32px",
              display: "inline-flex",
              gap: 36,
              marginBottom: 26,
            })}
          >
            {[
              { v: "4.3 ★★★★", s: "184K ratings · Google Play" },
              { v: "4.5 ★★★★★", s: "24.1K ratings · App Store" },
              { v: "4.1 ★★★★", s: "1K ratings · Trustpilot" },
            ].map((x, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={s({ fontSize: 16, fontWeight: 800, color: "#1e293b" })}
                >
                  {x.v}
                </div>
                <div style={s({ fontSize: 10, color: "#64748b" })}>{x.s}</div>
              </div>
            ))}
          </div>
          {/* Other services */}
          <div>
            <p style={s({ fontSize: 12, color: "#64748b", marginBottom: 12 })}>
              Other services by
            </p>
            <div
              style={s({
                display: "flex",
                gap: 14,
                justifyContent: "center",
                marginBottom: 28,
              })}
            >
              {["CHALLAN ↗", "SERVICE HISTORY ↗", "PERSONAL LOAN ↗"].map(
                (x, i) => (
                  <span
                    key={i}
                    style={s({
                      color: "#1e3a5f",
                      fontWeight: 600,
                      fontSize: 12,
                      textDecoration: "underline",
                    })}
                  >
                    {x}
                  </span>
                ),
              )}
            </div>
          </div>
          {/* Keep in touch */}
          <div
            style={s({
              borderTop: "1px solid #e2e8f0",
              paddingTop: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            })}
          >
            <div>
              <p
                style={s({
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#f97316",
                  margin: "0 0 3px",
                })}
              >
                Keep in touch
              </p>
              <p style={s({ fontSize: 11, color: "#64748b", margin: 0 })}>
                🌐 care@cars24.com
              </p>
            </div>
            <div style={s({ fontSize: 18, display: "flex", gap: 9 })}>
              {["📘", "▶️", "🐦", "💼", "📷"].map((ic, i) => (
                <span key={i}>{ic}</span>
              ))}
            </div>
          </div>
          <p
            style={s({
              fontSize: 9,
              color: "#94a3b8",
              marginTop: 18,
              lineHeight: 1.5,
            })}
          >
            Disclaimer: Service provided by Cars24 is conducted to the best of
            our ability and knowledge at the time of inspection. Cars24 shall
            not be liable for any direct, indirect, incidental or consequential
            damages rising in connection with any defect, damages, or
            misrepresentation related to the inspected vehicle. For further
            details, please refer to our T&Cs.
          </p>
        </div>
      </ReportPage>
    </>
  );
}
