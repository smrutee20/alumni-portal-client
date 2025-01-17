import SchemaForm, { Button } from "@/components/forms";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";
import alumniPrefillApi from "@/utils/api/alumniPrefill";
import cx from "classnames";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/constants/data";
import { NavLink } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import alumniMembershipSubmit from "@/utils/api/alumniMembershipSubmit";
import { MembershipPrefillDataType } from "@/types/Alumni.type";
import Alert from "@/components/Alert/Alert";

const MembershipForm = () => {
  const [userData, setUserData] = useState<MembershipPrefillDataType | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrefillData = async () => {
      try {
        const data = await alumniPrefillApi();
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        setErrorMsg((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefillData();
  }, []);

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "sign") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    try {
      const response = await alumniMembershipSubmit(formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <p>Please wait</p>
  ) : errorMsg ? (
    <Alert>{errorMsg}</Alert>
  ) : (
    userData && (
      <>
        <Alert severity="info">
          <p>
            Make sure your details are correct before applying for life
            membership. Go to your <NavLink to="/profile">profile</NavLink> to
            make any corrections.
          </p>
        </Alert>
        <section className={styles["box"]}>
          <h1 className={styles["title"]}>Profile details</h1>
          <div className={styles["box-table"]}>
            <div className={cx(styles["box-row"], styles.header)}>
              <div className={styles["col"]}>
                <h4 className={styles["box-col-header"]}>Personal details</h4>
              </div>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Full name</p>
              <p className={cx(styles.col, styles["value"])}>
                {dataValueLookup[userData.title]} {userData.first_name}{" "}
                {userData.last_name}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Date of Birth</p>
              <p className={cx(styles.col, styles["value"])}>
                {new Date(userData.dob).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                })}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Category</p>
              <p className={cx(styles.col, styles["value"])}>
                {dataValueLookup[userData.category]}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Nationality</p>
              <p className={cx(styles.col, styles["value"])}>
                {userData.nationality}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Religion</p>
              <p className={cx(styles.col, styles["value"])}>
                {userData.religion}
              </p>
            </div>
          </div>

          <div className={styles["box-table"]}>
            <div className={cx(styles["box-row"], styles.header)}>
              <div className={styles["col"]}>
                <h4 className={styles["box-col-header"]}>
                  Education at NIT Arunachal Pradesh
                </h4>
              </div>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>
                Registration no.
              </p>
              <p className={cx(styles.col, styles["value"])}>
                {userData.registration_no}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Roll no.</p>
              <p className={cx(styles.col, styles["value"])}>
                {userData.roll_no}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Course</p>
              <p className={cx(styles.col, styles["value"])}>
                {dataValueLookup[userData.degree]} in {userData.discipline}
              </p>
            </div>
            <div className={styles["box-row"]}>
              <p className={cx(styles.col, styles["label"])}>Graduation date</p>
              <p className={cx(styles.col, styles["value"])}>
                {new Date(userData.graduation_date).toLocaleDateString(
                  "en-IN",
                  { month: "long", year: "numeric" }
                )}
              </p>
            </div>
          </div>

          <div className={styles["box-table"]}>
            <div className={cx(styles["box-row"], styles.header)}>
              <div className={styles["col"]}>
                <h4 className={styles["box-col-header"]}>Address</h4>
              </div>
              <div className={styles["col"]}>
                <h4 className={styles["box-col-header"]}>Email & Phone</h4>
              </div>
            </div>
            <div className={styles["box-row"]}>
              <div className={styles["col"]}>
                <p className={styles["value"]}>{userData.address}</p>
                <p className={styles["value"]}>
                  {userData.city}, {userData.state}
                </p>
                <p
                  className={styles["value"]}
                >{`${userData.country} (${userData.pincode})`}</p>
              </div>
              <div className={styles["col"]}>
                <p className={styles["value"]}>{userData.email}</p>
                <p className={styles["value"]}>{userData.alt_email}</p>
                <p className={styles["value"]}>{userData.phone}</p>
                <p className={styles["value"]}>{userData.alt_phone}</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles["box"]}>
          <SchemaForm
            schema={[
              { type: "section", label: "Membership Preferences" },
              {
                name: "membership_level",
                label: "Membership level",
                type: "select",
                required: "Membership level is required",
                options: [
                  {
                    value: "level1_networking",
                    label:
                      "Yes! I am Interested to get information and networking only",
                  },
                  {
                    value: "level2_volunteering",
                    label:
                      "Yes! I am Interested in volunteering for events and activities",
                  },
                ],
              },
              {
                name: "sign",
                label: "Signature",
                type: "file",
                required: "Signature is required",
                allowedFormats: ["image/jpeg", "image/png", "image/gif"],
                maxFileSize: 200 * 1024,
              },
            ]}
            onSubmit={onSubmit}
            actions={
              <Button type="submit" className="btn primary">
                Submit for approval
              </Button>
            }
          />
        </section>
      </>
    )
  );
};

export default MembershipForm;
