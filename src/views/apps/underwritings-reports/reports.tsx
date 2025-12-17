"use client";
import React, { useEffect } from "react";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Snackbar,
  IconButton,
  Box,
  Autocomplete,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MuiAlert from "@mui/lab/Alert";
import SearchIcon from "@mui/icons-material/Search";

import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import TableViewIcon from "@mui/icons-material/TableView";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ReportService } from "@/services/remote-api/api/report-services";
import {
  getFieldsForCategory,
  categoryExists,
  VALUE_MAPPINGS,
  ReportField,
} from "./utills/reportUtils";
import { HierarchyService } from "@/services/remote-api/api/hierarchy-services";

const reportService = new ReportService();
const hierarchyService = new HierarchyService();

const useStyles = makeStyles((theme: any) => ({
  mainContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8", // Soft gray background
  },
  sidebar: {
    width: "300px", // Slightly wider for better readability
    backgroundColor: "#ffffff",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)", // Subtle border instead of shadow
    padding: "24px 16px",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
    flexShrink: 0,
    padding: "0 8px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1a202c", // Darker text for title
    // letterSpacing removed to match theme
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f7fafc",
      borderRadius: "12px", // More rounded
      fontSize: "14px",
      border: "1px solid transparent",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#edf2f7",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        borderColor: "#D80E51",
        boxShadow: "0 0 0 3px rgba(216, 14, 81, 0.1)",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 12px 10px 40px", // Space for icon
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  searchIcon: {
    position: "absolute",
    left: "12px", // Moved to left
    color: "#a0aec0",
    fontSize: "20px",
    pointerEvents: "none",
    zIndex: 1,
  },
  sidebarContent: {
    overflowY: "auto",
    flex: 1,
    paddingRight: "4px",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#cbd5e0",
      borderRadius: "3px",
      "&:hover": {
        background: "#a0aec0",
      },
    },
  },
  categoryListItem: {
    borderRadius: "10px",
    marginBottom: "4px",
    transition: "all 0.2s ease",
    padding: "10px 16px",
    minHeight: "48px",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      backgroundColor: "#fff5f7", // Very light pink hover
      color: "#D80E51",
    },
    "&.Mui-selected": {
      backgroundColor: "#fff0f4", // Light pink active background
      color: "#D80E51",
      "&:hover": {
        backgroundColor: "#ffe6ed",
      },
      "&::before": { // Active indicator line
        content: '""',
        position: "absolute",
        left: "0",
        top: "50%",
        transform: "translateY(-50%)",
        height: "24px",
        width: "4px",
        backgroundColor: "#D80E51",
        borderRadius: "0 4px 4px 0",
      },
      "& .MuiListItemText-primary": {
        color: "#D80E51",
        fontWeight: 600,
      },
    },
  },
  categoryText: {
    "& .MuiListItemText-primary": {
      fontSize: "14px",
      fontWeight: 500,
      color: "inherit", // Inherit from parent for hover/active states
    },
  },
  contentArea: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },
  paper: {
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", // Soft shadow
    backgroundColor: "#ffffff",
    border: "1px solid rgba(0, 0, 0, 0.02)",
  },
  formSection: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: "8px",
    // letterSpacing removed to match theme
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#718096",
    marginBottom: "32px",
  },
  dateGridContainer: {
    marginBottom: "24px",
  },
  fieldGridContainer: {
    marginBottom: "24px",
  },
  textField: {
    "& .MuiInputLabel-root": {
      color: "#718096",
      fontSize: "14px",
      "&.Mui-focused": {
        color: "#D80E51",
      },
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "#e2e8f0",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#cbd5e0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#D80E51",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(216, 14, 81, 0.05)",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "14px 16px",
      fontSize: "14px",
      color: "#2d3748",
    },
  },
  dateTextField: {
    "& .MuiInputLabel-root": {
      color: "#718096",
      fontSize: "14px",
      "&.Mui-focused": {
        color: "#D80E51",
      },
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "#e2e8f0",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#cbd5e0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#D80E51",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(216, 14, 81, 0.05)",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "14px 16px",
      fontSize: "14px",
      color: "#2d3748",
    },
  },
  iconButtonContainer: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "32px 0 0 0",
    borderTop: "1px solid #edf2f7",
    marginTop: "32px",
  },
  iconButton: {
    padding: "16px",
    borderRadius: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid transparent",
    backgroundColor: "#f7fafc",
    "&:hover": {
      backgroundColor: "#ffffff",
      transform: "translateY(-4px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
      borderColor: "rgba(0,0,0,0.05)",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 32px",
    color: "#a0aec0",
    textAlign: "center",
    "& p": {
      fontSize: "16px",
      marginTop: "16px",
      fontWeight: 500,
    },
  },
  noResults: {
    textAlign: "center",
    padding: "32px 16px",
    color: "#a0aec0",
    fontSize: "14px",
  },
}));

interface ServiceType {
  label: string;
  value: string;
}

const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 61 }, (_, i) => currentYear - 30 + i);

const CATEGORY_DATE_PREFIX: { [key: string]: string } = {
  INTERMEDIARY_PREMIUM: "Intermediary",
  PREMIUM_PER_MEMBER: "Member",
  POLICIES_DUE_FOR_RENEWAL: "Policy",
  AGENT_PERFORMANCE: "Agent",
  POLICY_LAPSED: "Policy",
  AGENT_COMMISSION: "Commission",
};

const Reports: React.FC = () => {
  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [selectedValues, setSelectedValues] = React.useState<{
    [key: string]: any;
  }>({
    endDate: new Date().getTime(),
  });

  const [serviceTypeList, setServiceTypeList] = React.useState<ServiceType[]>(
    []
  );
  const [dynamicFields, setDynamicFields] = React.useState<ReportField[]>([]);
  const [fieldData, setFieldData] = React.useState<{
    [key: string]: any[];
  }>({});

  const handleInputChange = (field: string, value: any) => {
    let formattedValue = value;

    if (
      field === "startDate" ||
      field === "endDate" ||
      field === "confirmedDate"
    ) {
      formattedValue = value ? new Date(value).getTime() : null;
    }

    setSelectedValues((prevState) => ({
      ...prevState,
      [field]: formattedValue,
    }));
  };

  const getDateLabelPrefix = (): string => {
    return CATEGORY_DATE_PREFIX[selectedCategory] || "Start/End";
  };

  useEffect(() => {
    const rl$ = reportService.getReportList();
    rl$.subscribe((result: any) => {
      const formattedArray: ServiceType[] = result.map((item: any) => ({
        label: item
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c: string) => c.toUpperCase()),
        value: item,
      }));

      setServiceTypeList(formattedArray);

      if (formattedArray.length > 0) {
        handleCategoryChange(formattedArray[0].value);
      }
    });
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    handleCategoryChange(categoryValue);
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);

    let fields: ReportField[] = [];

    if (categoryExists(categoryValue)) {
      fields = getFieldsForCategory(categoryValue);
    } else {
      const mappedValue = VALUE_MAPPINGS[categoryValue] || categoryValue;
      if (categoryExists(mappedValue)) {
        fields = getFieldsForCategory(mappedValue);
      }
    }

    if (fields.length > 0) {
      setDynamicFields(fields);

      const resetValues: { [key: string]: any } = {
        endDate: new Date().getTime(),
      };
      setSelectedValues(resetValues);

      fields.forEach((field) => {
        if (field.type === "autocomplete" && field.apiEndpoint) {
          if (
            field.apiEndpoint === "getBranches" ||
            field.apiEndpoint === "/api/branches"
          ) {
            const pageRequest = {
              page: 0,
              size: 1000,
            };

            hierarchyService.getBranches(pageRequest).subscribe({
              next: (response: any) => {
                console.log("Branch API Response:", response);

                const branches = response.content || response || [];
                const formattedBranches = branches.map((branch: any) => ({
                  label:
                    branch.centerName ||
                    branch.name ||
                    branch.branchName ||
                    branch.label,
                  value: branch.id || branch.branchId || branch.value,
                }));

                console.log("Formatted Branches:", formattedBranches);

                setFieldData((prev) => ({
                  ...prev,
                  [field.name]: formattedBranches,
                }));
              },
              error: (error) => {
                console.error("Error fetching branches:", error);
                setFieldData((prev) => ({
                  ...prev,
                  [field.name]: [],
                }));
              },
            });
          }
        }
      });
    } else {
      setDynamicFields([]);
    }
  };

  const filteredCategories = serviceTypeList.filter((service) =>
    service.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderField = (field: ReportField) => {
    if (
      field.type === "date" &&
      (field.name === "startDate" || field.name === "endDate")
    ) {
      return null;
    }

    switch (field.type) {
      case "date":
        return (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month", "day"]}
                label={field.label}
                maxDate={field.name === "endDate" ? new Date() : undefined}
                value={selectedValues[field.name] || null}
                onChange={(date) => handleInputChange(field.name, date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    className={classes.dateTextField}
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        );

      case "select":
        return (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={selectedValues[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                label={field.label}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );

      case "autocomplete":
        return (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <Autocomplete
              options={fieldData[field.name] || []}
              value={selectedValues[field.name] || null}
              onChange={(event, newValue) =>
                handleInputChange(field.name, newValue)
              }
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.label || ""
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  required={field.required}
                  className={classes.textField}
                />
              )}
            />
          </Grid>
        );

      case "number":
        return (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <TextField
              label={field.label}
              type="number"
              value={selectedValues[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              variant="outlined"
              fullWidth
              required={field.required}
              className={classes.textField}
            />
          </Grid>
        );

      case "text":
        return (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <TextField
              label={field.label}
              value={selectedValues[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              variant="outlined"
              fullWidth
              required={field.required}
              className={classes.textField}
            />
          </Grid>
        );

      default:
        return null;
    }
  };

  const DownloadReport = (format: string) => {
    const fileName = selectedCategory || "report";

    const basePayload = {
      reportType: selectedCategory,
      startDate: 0,
      endDate: 0,
      reportFormat: format,
      premium: 0,
      agentName: "",
      branchName: "",
      intermediaryType: "",
      productName: "",
      confirmedDate: 0,
      intermediaryName: "",
      year: 0,
      month: 0,
      proposer: "",
      memberStatus: "",
    };

    let payload: any = {
      ...basePayload,
      ...selectedValues,
      reportType: selectedCategory,
      reportFormat: format,
    };

    if (selectedValues.branch && typeof selectedValues.branch === "object") {
      payload.branchName = selectedValues.branch.label || "";
      delete payload.branch;
    }

    if (selectedValues.intermediary) {
      payload.intermediaryName = selectedValues.intermediary;
      delete payload.intermediary;
    }

    if (selectedValues.productName) {
      payload.productName = selectedValues.productName;
    }

    if (selectedCategory === "PREMIUM_PER_MEMBER") {
      payload = {
        ...basePayload,
        reportType: selectedCategory,
        reportFormat: format,
        startDate: selectedValues.startDate || 0,
        confirmedDate: selectedValues.confirmedDate || 0,
        endDate: 0,
      };
    }

    if (selectedCategory === "POLICIES_DUE_FOR_RENEWAL") {
      let yearTimestamp = 0;
      let monthTimestamp = 0;

      if (selectedValues.year) {
        const yearDate = new Date(selectedValues.year, 0, 1);
        yearTimestamp = yearDate.getTime();
      }

      if (selectedValues.month) {
        const year = selectedValues.year || new Date().getFullYear();
        const monthDate = new Date(year, selectedValues.month - 1, 1);
        monthTimestamp = monthDate.getTime();
      }

      payload = {
        ...basePayload,
        reportType: selectedCategory,
        reportFormat: format,
        startDate: selectedValues.startDate || 0,
        endDate: selectedValues.endDate || 0,
        year: yearTimestamp,
        month: monthTimestamp,
      };
    }

    reportService.downloadJSReport(payload, format).subscribe({
      next: (blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;

        const extension =
          format === "pdf" ? ".pdf" : format === "csv" ? ".csv" : ".xlsx";
        a.download = fileName + extension;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);

        setSnackbarMessage("Report downloaded successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      },

      error: async (error) => {
        let errorMessage = "Failed to download report";

        try {
          if (error?.response?.data instanceof Blob) {
            const text = await error.response.data.text();
            try {
              const json = JSON.parse(text);
              errorMessage =
                json?.message || error.response.statusText || errorMessage;
            } catch {
              errorMessage = text;
            }
          } else if (typeof error?.response?.data === "string") {
            const json = JSON.parse(error.response.data);
            errorMessage =
              json?.message || error.response.statusText || errorMessage;
          } else {
            errorMessage = error?.response?.statusText || errorMessage;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      },
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


  return (
    <Box className={classes.mainContainer}>
      <Box className={classes.sidebar}>
        <Box className={classes.sidebarHeader}>
          <div className={classes.sidebarTitle}>Report Categories</div>
          <Box className={classes.searchContainer}>
            <SearchIcon className={classes.searchIcon} />
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              className={classes.searchInput}
            />
          </Box>
        </Box>

        <Box className={classes.sidebarContent}>
          {filteredCategories.length > 0 ? (
            <List component="nav" disablePadding sx={{ pb: 7.5 }}>
              {filteredCategories.map((service) => (
                <React.Fragment key={service.value}>
                  <ListItemButton
                    selected={selectedCategory === service.value}
                    onClick={() => {
                      handleCategoryClick(service.value);
                      setSearchQuery("");
                    }}
                    className={classes.categoryListItem}
                  >
                    <ListItemText
                      primary={service.label}
                      className={classes.categoryText}
                    />
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <div className={classes.noResults}>
              No categories found for "{searchQuery}"
            </div>
          )}
        </Box>
      </Box>

      <Box className={classes.contentArea}>
        <Paper className={classes.paper}>
          {selectedCategory ? (
            <>
              <Box sx={{ mb: 4 }}>
                <div className={classes.sectionTitle}>
                  {serviceTypeList.find(s => s.value === selectedCategory)?.label || 'Report Configuration'}
                </div>
                <div className={classes.sectionSubtitle}>
                  Configure the parameters below to generate and download your report.
                </div>
              </Box>

              <Box className={classes.formSection}>
                <Grid
                  container
                  spacing={3}
                  className={classes.dateGridContainer}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={["year", "month", "day"]}
                        label="Policy Start Date"
                        value={selectedValues.startDate || null}
                        onChange={(date) =>
                          handleInputChange("startDate", date)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            className={classes.dateTextField}
                            variant="outlined"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={["year", "month", "day"]}
                        label="Policy End Date"
                        maxDate={new Date()}
                        value={selectedValues.endDate || null}
                        onChange={(date) =>
                          handleInputChange("endDate", date)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            className={classes.dateTextField}
                            variant="outlined"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>


              {dynamicFields.length > 0 && (
                <Box className={classes.formSection}>
                  <Grid
                    container
                    spacing={3}
                    className={classes.fieldGridContainer}
                  >
                    {dynamicFields.map((field) => renderField(field))}
                  </Grid>
                </Box>
              )}

              <Box className={classes.iconButtonContainer}>
                <Tooltip
                  title="Download Excel Report"
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#1D6F42',
                        fontSize: '13px',
                        fontWeight: 500,
                        '& .MuiTooltip-arrow': {
                          color: '#1D6F42',
                        },
                      },
                    },
                  }}
                >
                  <IconButton
                    onClick={() => DownloadReport("excel")}
                    size="large"
                    aria-label="download excel"
                    className={classes.iconButton}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TableViewIcon sx={{ color: "#1D6F42", fontSize: "28px" }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                          border: '1.5px solid #ffffff',
                        }}
                      >
                        <DownloadIcon sx={{ fontSize: '10px', color: '#1D6F42', fontWeight: 'bold' }} />
                      </Box>
                    </Box>
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Download PDF Report"
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#DC4C3E',
                        fontSize: '13px',
                        fontWeight: 500,
                        '& .MuiTooltip-arrow': {
                          color: '#DC4C3E',
                        },
                      },
                    },
                  }}
                >
                  <IconButton
                    onClick={() => DownloadReport("pdf")}
                    size="large"
                    aria-label="download pdf"
                    className={classes.iconButton}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArticleIcon sx={{ color: "#DC4C3E", fontSize: "28px" }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                          border: '1.5px solid #ffffff',
                        }}
                      >
                        <DownloadIcon sx={{ fontSize: '10px', color: '#DC4C3E', fontWeight: 'bold' }} />
                      </Box>
                    </Box>
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Download CSV Report"
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#1976D2',
                        fontSize: '13px',
                        fontWeight: 500,
                        '& .MuiTooltip-arrow': {
                          color: '#1976D2',
                        },
                      },
                    },
                  }}
                >
                  <IconButton
                    onClick={() => DownloadReport("csv")}
                    size="large"
                    aria-label="download csv"
                    className={classes.iconButton}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DescriptionIcon sx={{ color: "#1976D2", fontSize: "28px" }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                          border: '1.5px solid #ffffff',
                        }}
                      >
                        <DownloadIcon sx={{ fontSize: '10px', color: '#1976D2', fontWeight: 'bold' }} />
                      </Box>
                    </Box>
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box className={classes.emptyState}>
              <AssessmentIcon sx={{ fontSize: 64, color: '#e2e8f0', marginBottom: 2 }} />
              <p style={{ color: '#4a5568', fontSize: '18px', fontWeight: 600, margin: 0 }}>Select a Category</p>
              <p style={{ color: '#a0aec0', fontSize: '14px', marginTop: '8px' }}>Choose a report category from the sidebar to configure and download reports.</p>
            </Box>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2800}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;
