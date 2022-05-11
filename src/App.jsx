import React, { useState, useMemo, useEffect } from "react"
import { Grid, makeStyles } from "@material-ui/core";
import Add from "./components/Add";
import Leftbar from "./components/Leftbar";
import Navbar from "./components/Navbar";
import { UserContext, InboxContext } from "./UserContext";
import authService from "./services/auth.service";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home"
import Login from "./components/Login";
import Users from "./components/Users";
import EditUser from "./components/EditUser";
import ResetPassUser from "./components/ResetPassUser";
import Machines from "./components/Machines";
import FormMachine from "./components/FormMachine";
import FormMachineParts from "./components/FormMachineParts";
import Spareparts from "./components/Spareparts";
import FormSpareparts from "./components/FormSpareparts";
import SparepartsAdjust from "./components/SparepartsAdjust";
import SparepartsAdjustAdd from "./components/SparepartsAdjustAdd";
import SparepartsAdjustSubs from "./components/SparepartsAdjustSubs";
import SparepartsAdjustForm from "./components/SparepartsAdjustForm";
import Tools from "./components/Tools";
import FormTools from "./components/FormTools";
import ToolsAdjust from "./components/ToolsAdjust";
import ToolsAdjustForm from "./components/ToolsAdjustForm";
import ToolsAdjustList from "./components/ToolsAdjustList";
import CheckMachine from "./components/CheckMachine";
import FormCheckMachine from "./components/FormCheckMachine";
import ApprCheckMachine from "./components/ApprCheckMachine";
import FormApprCheckMachine from "./components/FormApprCheckMachine";
import Org from "./components/Org";
import OrgList from "./components/OrgList";
import OrgClass from "./components/OrgClass";
import FormOrgList from "./components/FormOrgList";
import FormOrgClass from "./components/FormOrgClass";
import Job from "./components/Job";
import JobList from "./components/JobList";
import FormJobList from "./components/FormJobList";
import JobClass from "./components/JobClass";
import FormJobClass from "./components/FormJobClass";
import Shift from "./components/Shift";
import FormShift from "./components/FormShift";
import Role from "./components/Role";
import FormRole from "./components/FormRole";
import Inbox from "./components/Inbox";
import FormInbox from "./components/FormInbox";
import DocInspection from "./components/DocInspection";
import FormDocInspection from "./components/FormDocInspection";
import DocInstruction from "./components/DocInstruction";
import SparepartsExcel from "./components/SparepartsExcel";
import FormSparepartsExcel from "./components/FormSparepartsExcel";
import FormToolsExcel from "./components/FormToolsExcel";
import ScheduleQc from "./components/ScheduleQc";
import FormScheduleQc from "./components/FormScheduleQc";
import FormScheduleQcExcel from "./components/FormScheduleQcExcel";
import ProblemMachine from "./components/ProblemMachine";
import FormProblemMachine from "./components/FormProblemMachine";
import ReportApprCheckMachine from "./components/ReportApprCheckMachine";
import ReportScheduleQc from "./components/ReportScheduleQc";
import ReportProblemMachine from "./components/ReportProblemMachine";
import ReportTools from "./components/ReportTools";
import ReportSpareparts from "./components/ReportSpareparts";
import ToolsType from "./components/ToolsType";
import FormToolsType from "./components/FormToolsType";
import Supplier from "./components/Supplier";
import FormSupplier from "./components/FormSupplier";
import FormSupplierExcel from "./components/FormSupplierExcel";
import Parts from "./components/Parts";
import FormParts from "./components/FormParts";
import FormPartsExcel from "./components/FormPartsExcel";
import Iqc from "./components/Iqc";
import FormIqc from "./components/FormIqc";
import IqcHold from "./components/IqcHold";
import FormIqcHold from "./components/FormIqcHold";
import IqcSummary from "./components/IqcSummary";
import FormIqcSummary from "./components/FormIqcSummary";
import WmItem from "./components/WmItem";
import FormWmItem from "./components/FormWmItem";
import WmItemCategory from "./components/WmItemCategory";
import FormWmItemCategory from "./components/FormWmItemCategory";
import WmModel from "./components/WmModel";
import FormWmModel from "./components/FormWmModel";
import WmType from "./components/WmType";
import FormWmType from "./components/FormWmType";
import ReportOqc from "./components/ReportOqc";

const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("xs")] : {
      display: "none"
    },
    
  }
}));

const App = () => {
  const classes = useStyles();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [totalNotif, setTotalNotif] = useState(authService.getTotalInboxUser());

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const valueInbox = useMemo(() => ({ totalNotif, setTotalNotif }), [totalNotif, setTotalNotif]);

  return (
    <UserContext.Provider value={value}>
      <InboxContext.Provider value={valueInbox}>
      <Navbar />
      <Grid container>
        <Grid item xs={2}>
          <Leftbar/>
        </Grid>
        <Grid item xs={10}>
          <Routes>
            <Route path="wm-type" element={<WmType />} />
            <Route path="wm-type/form" element={<FormWmType />} />
            <Route path="wm-type/form/:id" element={<FormWmType />} />
            <Route path="wm-model" element={<WmModel />} />
            <Route path="wm-model/form" element={<FormWmModel />} />
            <Route path="wm-model/form/:id" element={<FormWmModel />} />
            <Route path="wm-item-category" element={<WmItemCategory />} />
            <Route path="wm-item-category/form" element={<FormWmItemCategory />} />
            <Route path="wm-item-category/form/:id" element={<FormWmItemCategory />} />
            <Route path="wm-item" element={<WmItem />} />
            <Route path="wm-item/form" element={<FormWmItem />} />
            <Route path="wm-item/form/:id" element={<FormWmItem />} />
            <Route path="approval-oqc/form/:id" element={<FormApprCheckMachine />} />
            <Route path="approval-oqc" element={<ApprCheckMachine />} />
            <Route path="oqc/form/:id" element={<FormCheckMachine />} />
            <Route path="oqc" element={<CheckMachine />} />
            <Route path="iqc-summary/form/:id" element={<FormIqcSummary/>} />
            <Route path="iqc-summary" element={<IqcSummary />} />
            <Route path="iqc-hold" element={<IqcHold />} />
            <Route path="iqc-hold/form/:id" element={<FormIqcHold />} />
            <Route path="iqc" element={<Iqc />} />
            <Route path="iqc/form" element={<FormIqc />} />
            <Route path="iqc/form/:id" element={<FormIqc />} />
            <Route path="parts" element={<Parts />} />
            <Route path="parts/form" element={<FormParts />} />
            <Route path="parts/form/:id" element={<FormParts />} />
            <Route path="parts/upload-excel" element={<FormPartsExcel />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="supplier/form" element={<FormSupplier />} />
            <Route path="supplier/form/:id" element={<FormSupplier />} />
            <Route path="supplier/upload-excel" element={<FormSupplierExcel />} />
            <Route path="tools-type" element={<ToolsType />} />
            <Route path="tools-type/form" element={<FormToolsType />} />
            <Route path="tools-type/form/:id" element={<FormToolsType />} />
            <Route path="report/spareparts" element={<ReportSpareparts/>} />
            <Route path="report/tools" element={<ReportTools/>} />
            <Route path="report/problem-machine" element={<ReportProblemMachine/>} />
            <Route path="report/appr-check-machine" element={<ReportApprCheckMachine/>} />
            <Route path="report/schedule-qc" element={<ReportScheduleQc/>} />
            <Route path="report/oqc" element={<ReportOqc/>} />
            <Route path="report/oqc/form/:id" element={<FormApprCheckMachine />} />
            <Route path="doc-instruction" element={<DocInstruction/>} />
            <Route path="problem-machine" element={<ProblemMachine/>} />
            <Route path="problem-machine/form" element={<FormProblemMachine/>} />
            <Route path="problem-machine/form/:id" element={<FormProblemMachine/>} />
            <Route path="schedule-qc" element={<ScheduleQc/>} />
            <Route path="schedule-qc/form" element={<FormScheduleQc/>} />
            <Route path="schedule-qc/form/:id" element={<FormScheduleQc/>} />
            <Route path="schedule-qc/upload-excel" element={<FormScheduleQcExcel />} />
            <Route path="doc-inspection" element={<DocInspection />} />
            <Route path="doc-inspection/form" element={<FormDocInspection />} />
            <Route path="doc-inspection/form/:id" element={<FormDocInspection />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="inbox/form/:id" element={<FormInbox />} />
            <Route path="role" element={<Role />} />
            <Route path="role/form" element={<FormRole />} />
            <Route path="role/form/:id" element={<FormRole />} />
            <Route path="shift" element={<Shift/>} />
            <Route path="shift/form" element={<FormShift/>} />
            <Route path="shift/form/:id" element={<FormShift/>} />
            <Route path="job" element={<Job />} >
              <Route path="list" element={<JobList />} />
              <Route path="form/:id" element={<FormJobList />} />
              <Route path="form" element={<FormJobList />} />
              <Route path="class" element={<JobClass />} />
              <Route path="class/form" element={<FormJobClass />} />
              <Route path="class/form/:id" element={<FormJobClass />} />
            </Route>
            <Route path="organization" element={<Org/>} >
              <Route path="list" element={<OrgList />} />
              <Route path="form/:id" element={<FormOrgList />} />
              <Route path="form" element={<FormOrgList />} />
              <Route path="class" element={<OrgClass />} />
              <Route path="class/form" element={<FormOrgClass />} />
              <Route path="class/form/:id" element={<FormOrgClass />} />
            </Route>
            <Route path="check-machine" element={<CheckMachine/>} />
            <Route path="check-machine/form/:id/:code" element={<FormCheckMachine/>} />
            <Route path="appr-check-machine" element={<ApprCheckMachine />} />
            <Route path="appr-check-machine/form/:id" element={<FormApprCheckMachine />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/form" element={<FormTools />} />
            <Route path="tools/upload-excel" element={<FormToolsExcel />} />
            <Route path="tools/form/:id" element={<FormTools />} />
            <Route path="tools-adjust/:id" element={<ToolsAdjust />} >
              <Route path="list" element={<ToolsAdjustList />} />
              <Route path="form" element={<ToolsAdjustForm />} />
            </Route>
            <Route path="spareparts" element={<Spareparts/>} />
            <Route path="spareparts/excel" element={<SparepartsExcel/>} />
            <Route path="spareparts/upload-excel" element={<FormSparepartsExcel/>} />
            <Route path="spareparts/form" element={<FormSpareparts/>} />
            <Route path="spareparts/form/:id" element={<FormSpareparts/>} />
            <Route path="spareparts-adjust/:id" element={<SparepartsAdjust/>} >
              <Route path="addition" element={<SparepartsAdjustAdd/>} />
              <Route path="substraction" element={<SparepartsAdjustSubs/>} />
              <Route path="form" element={<SparepartsAdjustForm/>} />
            </Route>
            <Route path="machines" element={<Machines/>} />
            <Route path="machines/form" element={<FormMachine/>} />
            <Route path="machines/form/:id" element={<FormMachine/>} />
            <Route path="machines/parts/:id" element={<FormMachineParts/>} />
            <Route path="users" element={<Users/>} />
            <Route path="users/:id" element={<EditUser/>} />
            <Route path="users/reset/:id" element={<ResetPassUser/>} />
            <Route path="login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </Grid>
        
      </Grid>
    </InboxContext.Provider>
  </UserContext.Provider>
  );
};

export default App;