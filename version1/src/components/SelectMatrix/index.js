import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const rows = [
  {
    id: 1,
    alert: "Row header1",
    sla: 10,
    manager: "Damien Smith",
    ownertype: "Individual",
    role: "Blank",
  },
  {
    id: 2,
    alert: "Row header2",
    sla: 5,
    manager: "Celia Kounou",
    ownertype: "Individual",
    role: "Blank",
  },
  {
    id: 3,
    alert: "Row header3",
    sla: 2,
    manager: "Martin king",
    ownertype: "Role",
    role: "Blank",
  },
  {
    id: 4,
    alert: "Row header3",
    sla: 6,
    manager: "Alice Kuma",
    ownertype: "Individual",
    role: "Blank",
  },
  {
    id: 5,
    alert: "Row header4",
    sla: 6,
    manager: "Damien Smith",
    ownertype: "Role",
    role: "Blank",
  },
  {
    id: 6,
    alert: "Row header5",
    sla: 6,
    manager: "Lucien Alington",
    ownertype: "Role",
    role: "Blank",
  },
];

const individual_usernames = [
  { displayValue: "Martin king", lookupId: 1 },
  { displayValue: "Alice Kuma", lookupId: 2 },
  { displayValue: "Keisha kyei", lookupId: 3 },
  { displayValue: "christian john", lookupId: 4 },
  { displayValue: "Damien Smith", lookupId: 5 },
  { displayValue: "Demo user", lookupId: 6 },
  { displayValue: "Demo Salesrep", lookupId: 7 },
  { displayValue: "Lucien Alington", lookupId: 8 },
  { displayValue: "Salami Abdoul", lookupId: 9 },
  { displayValue: "Sheilla Benson", lookupId: 1 },
  { displayValue: "Tatiana Adamako", lookupId: 2 },
  { displayValue: "Celia Kounou", lookupId: 3 },
  { displayValue: "Perez Bakinde", lookupId: 4 },
  { displayValue: "Harold Tade", lookupId: 5 },
  { displayValue: "Julien Mgoma", lookupId: 6 },
];

const sales_data = [{ displayValue: "Sales Rep", lookupId: 1 }];

const owners = [
  { displayValue: "Blank", lookupId: 1 },
  { displayValue: "Individual", lookupId: 2 },
  { displayValue: "Role", lookupId: 3 },
];

const ConditionalSelect = ({
  comboParams: {
    dropDownContent,
    comboState,
    handleComboChange,
    settingName,
    colNum,
    recordCount,
    recordId,
  },
}) => {
  return (
    <select
      data-recid={recordId}
      data-count={recordCount}
      data-colname={settingName}
      data-colnum={colNum}
      name={`${settingName}${recordId}`}
      value={comboState[`${settingName}${recordId}`]}
      onChange={handleComboChange}
      style={{ width: "100%" }}
    >
      <option value={0}></option>
      {dropDownContent.length &&
        dropDownContent.map((drop) => {
          return (
            <option value={`${drop.lookupId}-${drop.displayValue}`}>
              {drop.displayValue}
            </option>
          );
        })}
    </select>
  );
};

function SelectMatrix(props) {
  const [comboState, setComboState] = useState({});
  const [editModeOn, setEditModeOn] = useState(false);
  const [data, setData] = useState(rows);
  const [oldData, setOldData] = useState(rows);
  const [dataEdited, setDataEdited] = useState();
  const [currentOwnerType, setCurrentOwnerType] = useState("Blank");
  const [currentlyModifiedRow, setCurrentlyModifiedRow] = useState(null);
  const [dy_drop_data, setDy_drop_data] = useState({});

  useEffect(() => {
    setData(rows.length ? rows : []);
  }, []);

  const handleComboChange = (e) => {
    const { name, value, dataset } = e.target || e.currentTarget;
    const { recid, colnum, colname: col, count } = dataset;
    console.log(
      "name",
      name,
      "value",
      value,
      "row",
      recid,
      "count",
      count,
      "colnum",
      colnum
    );

    const comboValue = value.split("-");
    setComboState((prev) => {
      return { ...prev, [name]: value };
    });
    if (col === "ownertype") {
      setCurrentOwnerType(comboValue[1]);
      setCurrentlyModifiedRow(count);

      setDy_drop_data((prevState) => {
        const old_dy_data = { ...prevState };
        if (!old_dy_data["role"]) {
          old_dy_data["role"] = {};
        }
        if (currentOwnerType === "Blank") {
          old_dy_data["role"][count] = [];
        } else if (currentOwnerType === "Individual") {
          old_dy_data["role"][count] = individual_usernames;
        } else if (currentOwnerType === "Role") {
          old_dy_data["role"][count] = sales_data;
        }
        console.log("aoldData", old_dy_data["role"]);
        return old_dy_data;
      });
    }
    setDataEdited((prev) => {
      const oldEdited = prev || [];
      const oldIndex = oldEdited?.findIndex((row) => row.name === name);
      if (oldIndex > -1) {
        oldEdited[oldIndex] = {
          field: col,
          value: comboValue[0],
          displayValue: comboValue[1],
          id: recid,
          rowCount: count,
        };
      } else {
        oldEdited.push({
          field: col,
          value: comboValue[0],
          displayValue: comboValue[1],
          id: recid,
          rowCount: count,
        });
      }
      return oldEdited;
    });
  };

  const handleEditMode = () => {
    setEditModeOn(true);
  };

  const handleCancel = () => {
    setEditModeOn(false);
  };

  const updateOldData = (edited, oldRecords) => {
    const newData = oldRecords;
    for (const ed of edited) {
      const { field, rowCount, value, displayValue, id } = ed;
      newData[rowCount] = { ...newData[rowCount], [field]: displayValue };
    }
    return newData;
  };
  async function handleConfirm() {
    try {
      const newData = updateOldData(dataEdited, oldData);
      //const payload = { ...formValues, action: "save", id: 286 };
      console.log("dataEdited ", dataEdited);
      setData(newData);
      setEditModeOn(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Alert</TableCell>
              <TableCell>SLA</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Owner Type</TableCell>
              <TableCell>Owner/Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length &&
              data.map((row, key) => {
                const comboParams = {
                  comboState,
                  handleComboChange,
                  recordId: row.id,
                  recordCount: key,
                };
                let roleCombo = [];
                if (dy_drop_data["role"] && dy_drop_data["role"][key]) {
                  roleCombo = dy_drop_data["role"][key];
                }
                // console.log("dy_drop_data", dy_drop_data);
                return (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.alert}</TableCell>
                    <TableCell>{row.sla}</TableCell>
                    <TableCell>
                      {editModeOn ? (
                        <ConditionalSelect
                          comboParams={{
                            ...comboParams,
                            dropDownContent: individual_usernames,
                            colNum: 3,
                            settingName: "manager",
                          }}
                        />
                      ) : (
                        row.manager
                      )}
                    </TableCell>
                    <TableCell>
                      {editModeOn ? (
                        <ConditionalSelect
                          comboParams={{
                            ...comboParams,
                            dropDownContent: owners,
                            colNum: 4,
                            settingName: "ownertype",
                          }}
                        />
                      ) : (
                        row.ownertype
                      )}
                    </TableCell>
                    <TableCell>
                      {editModeOn ? (
                        <ConditionalSelect
                          comboParams={{
                            ...comboParams,
                            dropDownContent: roleCombo,
                            colNum: 5,
                            settingName: "role",
                          }}
                        />
                      ) : (
                        row.role
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={1} mt={2}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Grid justifyContent="flex-end" container spacing={1}>
            <Grid item>
              {!editModeOn && (
                <Button
                  variant="contained"
                  size="small"
                  className="background-theme-blue sub-header-button"
                  onClick={handleEditMode}
                >
                  Edit
                </Button>
              )}
            </Grid>
            <Grid item>
              {editModeOn && (
                <Button
                  variant="contained"
                  size="small"
                  className="background-theme-green sub-header-button"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              )}
            </Grid>
            <Grid item>
              {editModeOn && (
                <Button
                  variant="contained"
                  size="small"
                  className="background-theme-red sub-header-button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default SelectMatrix;
