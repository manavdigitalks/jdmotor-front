import api from "./axios";
import type { FormData } from "../types/form";

// ─── Section 1 Payload ───────────────────────────────────────────────────────
const buildSection1 = (data: FormData) => ({
  vehicle_details: {
    company_name: data.companyName,
    car_name: data.carName,
    variant: data.variantName,
    model_year: data.modal ? Number(data.modal) : undefined,
    model_month: data.modelMonth || undefined,
    type: data.type,
    fuel_type: data.fuelType,
    state: data.location,
    city: data.cityName,
    inspection_date: data.reportDate,
    inspected_by: data.Inspected_by,
    inspection_type: data.inspectionType,
  },
});

// ─── Section 2 Payload (multipart — car_image file che) ──────────────────────
// const buildSection2FormData = (data: FormData): FormData_Web => {
//   const fd = new FormData() as unknown as FormData_Web;
//   const f = fd as unknown as globalThis.FormData;

//   f.append("overall_rating", data.overallRating);
//   f.append("rating_title", data.ratingTitle);
//   f.append("odometer", data.odometer_km);
//   f.append("estimated_value", data.estimateValue);
//   f.append("ownership_no", data.ownershipNo);
//   f.append("summary", data.healthSummary);
//   f.append("owner_name", data.ownerName);
//   f.append("ownership_type", data.ownershipType);
//   if (data.regDate) f.append("registration_date", data.regDate);
//   if (data.regPlace) f.append("registration_place", data.regPlace);
//   if (data.fitnessValidity) f.append("fitness_validity", data.fitnessValidity);
//   if (data.puccValidity) f.append("pucc_validity", data.puccValidity);
//   f.append("blacklisted", data.blacklisted === "true" ? "Yes" : "No");
//   if (data.car_image) f.append("car_image", data.car_image);

//   return f as unknown as FormData_Web;
// };
// ─── Section 2 Payload ──────────────────────
const buildSection2FormData = (data: FormData): FormData_Web => {
  const fd = new FormData() as unknown as FormData_Web;
  const f = fd as unknown as globalThis.FormData;

  const summaryOwnership = {
    overall_rating: data.overallRating ? Number(data.overallRating) : undefined,
    rating_title: data.ratingTitle,
    odometer: data.odometer_km ? Number(data.odometer_km) : undefined,
    estimated_value: data.estimateValue
      ? Number(data.estimateValue.replace(/[^0-9.]/g, "")) || undefined
      : undefined,
    ownership_no: data.ownershipNo ? Number(data.ownershipNo) : undefined,
    summary: data.healthSummary,
    owner_name: data.ownerName,
    ownership_type: data.ownershipType,
    registration_date: data.regDate || undefined,
    registration_place: data.regPlace || undefined,
    fitness_validity: data.fitnessValidity || undefined,
    pucc_validity: data.puccValidity || undefined,
    rto_noc_issue_date: data.rtoNocDate || undefined,
    blacklisted: data.blacklisted === "true" ? "Yes" : "No",
  };

  f.append("car_summary_ownership", JSON.stringify(summaryOwnership));

  // ✅ Sirf File object hoy tyare j append karo, string nahi
  if (data.car_image && data.car_image instanceof File) {
    f.append("car_image", data.car_image);
  }

  return f as unknown as FormData_Web;
};

// ─── Section 3 Payload ───────────────────────────────────────────────────────
const buildSection3 = (data: FormData) => ({
  transferability_legal: {
    // rto_noc_issue_date: data.rtoNocDate || undefined,
    // party_peshi_applicability: data.partyPeshi,
    hypothecation: data.hypothecation,
    financier_name: data.financierName,
    // converted: data.modConverted,
    // migration: data.modMigration,
    // adapted_for_special_use: data.modAdapter,
    any_changes_or_modifications: data.anyModification,
    // criminal_case: data.criminalCases ? Number(data.criminalCases) : 0,
    // civil_case: data.civilCases ? Number(data.civilCases) : 0,
    // road_accidents: data.roadAccidents ? Number(data.roadAccidents) : 0,
    // theft_cases: data.theftCases ? Number(data.theftCases) : 0,
    // compensation_case: data.compensationCases
    //   ? Number(data.compensationCases)
    //   : 0,
    // other_case: data.otherCases ? Number(data.otherCases) : 0,
  },
});

// ─── Section 4 Payload ───────────────────────────────────────────────────────
const buildSection4 = (data: FormData) => ({
  category_ratings: {
    tyre_rating: data.tyresRating ? Number(data.tyresRating) : undefined,
    tyre_rating_title: data.tyresRatingTitle,
    engine_rating: data.engineRating ? Number(data.engineRating) : undefined,
    engine_rating_title: data.engineRatingTitle,
    steering_rating: data.steeringRating
      ? Number(data.steeringRating)
      : undefined,
    steering_rating_title: data.steeringRatingTitle,
    ac_rating: data.acRating ? Number(data.acRating) : undefined,
    ac_rating_title: data.acRatingTitle,
    electrics_rating: data.electricalsRating
      ? Number(data.electricalsRating)
      : undefined,
    electrics_rating_title: data.electricalsRatingTitle,
  },
});

// ─── Section 5 Payload (multipart — vehicle images) ──────────────────────────
const buildSection5FormData = (data: FormData): globalThis.FormData => {
  const fd = new globalThis.FormData();
  data.vehicle_images.forEach((file) => {
    if (file) fd.append("section_5_images", file);
  });
  return fd;
};

// ─── Section 6 Payload ───────────────────────────────────────────────────────
const buildSection6 = (data: FormData) => {
  const mappedParams = Object.fromEntries(
    Object.entries(data.ext_params).map(([k, v]) => [k.replace("ext_", ""), v]),
  );

  return {
    exterior_tyres_inspection: {
      subsection_parameters: mappedParams,
      cost: data.ext_repair_cost ? Number(data.ext_repair_cost) : 0,
    },
  };
};

// ─── Section 7 Payload ───────────────────────────────────────────────────────
const buildSection7 = (data: FormData) => {
  const removePrefix = (obj: Record<string, string>, prefix: string) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        let key = k.replace(prefix, "");

        // special case
        if (key === "4_power_windows") key = "power_windows_4";
        if (key === "engine_oil_level_dipstick") key = "engine_oil_level";

        return [key, v];
      }),
    );

  return {
    section_7: {
      subsection_engine_transmission: removePrefix(data.eng_params, "eng_"),
      subsection_electricals_interiors: removePrefix(data.elec_params, "elec_"),
      subsection_steering_suspension_brakes: removePrefix(
        data.str_params,
        "str_",
      ),
      subsection_air_condition: removePrefix(data.ac_params, "ac_"),
      subsection_other_details: removePrefix(data.oth_params, "oth_"),

      cost: data.engine_repair_cost ? Number(data.engine_repair_cost) : 0,

      cost_ssb: data.steering_repair_cost
        ? Number(data.steering_repair_cost)
        : 0,

      total_air_bag_number: data.totalAirbags
        ? Number(data.totalAirbags)
        : undefined,

      total_no_of_power_window_number: data.totalPowerWindows
        ? Number(data.totalPowerWindows)
        : undefined,
    },
  };
};

// ─── Section 8 Payload (multipart — other images with titles) ────────────────
const buildSection8FormData = (data: FormData): globalThis.FormData => {
  const fd = new globalThis.FormData();

  // Only filled images collect karo
  const filledImages: File[] = [];
  const filledTitles: string[] = [];

  data.other_images.forEach((file, idx) => {
    if (file) {
      filledImages.push(file);
      filledTitles.push(data.other_image_titles[idx] || "");
    }
  });

  // titles as JSON string array — API expects: '["Front View", "Rear View"]'
  fd.append("other_image_titles", JSON.stringify(filledTitles));

  // each file separately — API expects multiple 'other_images' fields
  filledImages.forEach((file) => {
    fd.append("other_images", file);
  });

  return fd;
};

// ─── Section 9 Payload ───────────────────────────────────────────────────────
const buildSection9 = (data: FormData) => ({
  oem_feature_space: {
    power_window: data.oem_power_window,
    airbags: data.oem_airbags_count,
    seating_capacity: data.oem_seating_capacity
      ? Number(data.oem_seating_capacity)
      : undefined,
    front_fog_lights: data.oem_front_fog_lights,
    isofix_child_anchor: data.oem_isofix,
    abs: data.oem_abs,
    center_locking: data.oem_central_locking,
    rear_defogger: data.oem_rear_defogger,
    airbags_count: data.oem_airbags_safety
      ? Number(data.oem_airbags_safety)
      : undefined,
    max_power_bhp: data.oem_max_power_bhp,
    max_torque: data.oem_max_torque_nm,
    fuel_tank_capacity: data.oem_fuel_tank_lit
      ? Number(data.oem_fuel_tank_lit)
      : undefined,
    emission_standard: data.oem_emission_standard,
    instrument_panel_type: data.oem_instrument_panel,
    camera_360: data.oem_360_camera,
    speaker_brand: data.oem_speaker_brand,
    no_of_speaker: data.oem_no_of_speakers
      ? Number(data.oem_no_of_speakers)
      : undefined,
    infotainment_system: data.oem_infotainment,
    gps: data.oem_gps,
    steering_audio_controls: data.oem_steering_audio_ctrl,
    smart_connectivity: data.oem_smart_connectivity,
    display_screen_size: data.oem_display_screen_size,
    multi_function_in_display: data.oem_multi_display_size,
    body_type: data.oem_body_type,
    no_of_seating_rows: data.oem_seating_rows
      ? Number(data.oem_seating_rows)
      : undefined,
    bootspace: data.oem_bootspace_lit
      ? Number(data.oem_bootspace_lit)
      : undefined,
    width: data.oem_width_mm ? Number(data.oem_width_mm) : undefined,
    gearbox: data.oem_gearbox_gears,
    displacement: data.oem_displacement_cc
      ? Number(data.oem_displacement_cc)
      : undefined,
    transmission_type: data.oem_transmission_type,
    cylinders: data.oem_cylinders ? Number(data.oem_cylinders) : undefined,
    brake_type_rear: data.oem_brake_rear,
    brake_type_front: data.oem_brake_front,
    no_of_disc_brake: data.oem_disc_brakes
      ? Number(data.oem_disc_brakes)
      : undefined,
    seat_upholstery: data.oem_seat_upholstery,
    auto_climate_control: data.oem_auto_climate,
    wireless_charging_pad: data.oem_wireless_charging,
    steering_wheel_material: data.oem_steering_material,
    smart_card: data.oem_smart_key,
    top_model: data.oem_top_model,
    parking_sensor: data.oem_parking_sensors,
    rear_ac: data.oem_rear_ac,
    power_windows: data.oem_power_windows_pos,
    steering_adjustment: data.oem_steering_adjust,
    driver_seat_adjustment: data.oem_driver_seat_adjust,
    cruise_control: data.oem_cruise_control,
    air_conditioner: data.oem_air_conditioner,
    push_button_start: data.oem_push_button_start,
  },
});

// ─── API CALLS ───────────────────────────────────────────────────────────────

/** Step 1 — POST: Navi inspection create karo, _id return thase */
export const createInspection = async (data: FormData): Promise<string> => {
  const res = await api.post("/car-inspections", buildSection1(data));
  return res.data.data._id as string;
};

/** Step 1 — PUT: Already created inspection update karo (user back avine change kare) */
export const updateSection1 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection1(data));
};

/** Step 2 — PUT: Car summary + car_image upload */
// export const updateSection2 = async (id: string, data: FormData) => {
//   const fd = buildSection2FormData(data);
//   const res = await api.put(
//     `/car-inspections/${id}`,
//     fd as unknown as globalThis.FormData,
//     {
//       headers: { "Content-Type": "multipart/form-data" },
//     },
//   );
//   return res.data.data.car_summary_ownership as { car_image: string };
// };
export const updateSection2 = async (id: string, data: FormData) => {
  const fd = buildSection2FormData(data);
  const res = await api.put(
    `/car-inspections/${id}`,
    fd as unknown as globalThis.FormData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return res.data.data.car_summary_ownership;
};

/** Step 3 — PUT: Transferability & Legal */
export const updateSection3 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection3(data));
};

/** Step 4 — PUT: Category Ratings */
export const updateSection4 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection4(data));
};

/** Step 5 — PUT: Vehicle images (section_5_images) */
export const updateSection5 = async (id: string, data: FormData) => {
  const fd = buildSection5FormData(data);
  const res = await api.put(`/car-inspections/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data as { section_5_images: string[] };
};

/** Step 6 — PUT: Exterior & Tyres */
export const updateSection6 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection6(data));
};

/** Step 7 — PUT: Engine, Trans, Elec, Susp */
export const updateSection7 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection7(data));
};

/** Step 8 — PUT: Other images with titles (multipart) */
export const updateSection8 = async (id: string, data: FormData) => {
  const fd = buildSection8FormData(data);
  const res = await api.put(`/car-inspections/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data as { other_images: { image_url: string }[] };
};

/** Step 9 — PUT: OEM Features & Space (last step = submit) */
export const updateSection9 = async (
  id: string,
  data: FormData,
): Promise<void> => {
  await api.put(`/car-inspections/${id}`, buildSection9(data));
};

// Internal type helper (avoid conflict with form's FormData type)
type FormData_Web = globalThis.FormData;

/** Report page — GET inspection by ID */
export const getInspectionById = async (id: string) => {
  const res = await api.get(`/car-inspections/${id}`);
  return res.data.data;
};
