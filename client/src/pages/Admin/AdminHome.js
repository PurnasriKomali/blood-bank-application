import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App </h3>
          <hr />
          <p>
            Blood banks serve as the cornerstone of modern medicine, offering a
            lifeline to patients in their most vulnerable moments. The
            availability of safe and compatible blood products is instrumental
            in addressing a myriad of medical needs, ranging from routine
            surgeries to complex emergency procedures. Without the timely
            intervention of blood banks, many lives would hang in the balance,
            as access to blood transfusions remains a critical component of
            healthcare delivery. Moreover, blood banks play a pivotal role in
            fostering community resilience by instilling a sense of collective
            responsibility towards blood donation. By nurturing a culture of
            philanthropy and solidarity, blood banks not only replenish blood
            supplies but also cultivate a spirit of empathy and compassion
            within society. Communities come together in blood donation drives,
            recognizing the power of unity in sustaining life-saving efforts.
            Furthermore, blood banks facilitate medical advancements through
            research initiatives, providing researchers with vital resources for
            understanding diseases and developing innovative treatments. In
            essence, blood banks are more than just repositories of blood; they
            are bastions of hope, fortifying the bonds of humanity and
            safeguarding the well-being of individuals and communities alike.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
