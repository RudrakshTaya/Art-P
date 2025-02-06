
import React, { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { CalendarToday, Edit, Person, CameraAlt } from "@mui/icons-material"

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  marginTop: theme.spacing(4),
  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
  "&:hover": {
    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
  },
}))

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "auto",
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: `0 0 0 5px ${theme.palette.primary.main}`,
}))

const InfoItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

function AccountInfo() {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    dateOfBirth: "",
    photo: null,
  })

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("https://craftaura-backend.onrender.com/api/account/account-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserInfo(response.data)
        setFormData({
          username: response.data.username,
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split("T")[0] : "",
        })
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch account info.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))
  }

  const handleUpdate = async () => {
    const updateRequests = []
    const headers = { Authorization: `Bearer ${token}` }

    try {
      if (formData.username !== userInfo.username) {
        updateRequests.push(
          axios.put("https://craftaura-backend.onrender.com/api/account/update-username", { username: formData.username }, { headers }),
        )
      }

      if (formData.dateOfBirth && formData.dateOfBirth !== userInfo.dateOfBirth) {
        updateRequests.push(
          axios.put(
            "https://craftaura-backend.onrender.com/api/account/update-dob",
            { dateOfBirth: new Date(formData.dateOfBirth).toISOString() },
            { headers },
          ),
        )
      }

      if (formData.photo) {
        const photoData = new FormData()
        photoData.append("profilePhoto", formData.photo)

        updateRequests.push(axios.put("https://craftaura-backend.onrender.com/api/account/update-photo", photoData, { headers }))
      }

      await Promise.all(updateRequests)

      setEditMode(false)

      const response = await axios.get("https://craftaura-backend.onrender.com/api/account/account-info", {
        headers,
      })
      setUserInfo(response.data)

      alert("Account updated successfully!")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account.")
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    )
  }

  return (
    <Fade in={true}>
      <StyledCard>
        <CardHeader title="Account Information" titleTypographyProps={{ align: "center", variant: "h4" }} />
        <CardContent>
          <Box position="relative" display="inline-block" marginBottom={4}>
            <ProfileAvatar src={userInfo.photo || "https://via.placeholder.com/150"} alt="Profile" />
            {editMode && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                }}
              >
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                <CameraAlt sx={{ color: "white" }} />
              </IconButton>
            )}
          </Box>
          {!editMode ? (
            <Grid container spacing={2}>
              {[
                { label: "Full Name", value: userInfo.fullName, icon: <Person /> },
                { label: "Username", value: userInfo.username, icon: <Person /> },
                { label: "Email", value: userInfo.email, icon: <Person /> },
                { label: "Phone Number", value: userInfo.phoneNumber, icon: <Person /> },
                { label: "Role", value: userInfo.role, icon: <Person /> },
                {
                  label: "Date of Birth",
                  value: userInfo.dateOfBirth ? format(new Date(userInfo.dateOfBirth), "PPP") : "Not set",
                  icon: <CalendarToday />,
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <InfoItem>
                    <Box display="flex" alignItems="center" marginBottom={1}>
                      {item.icon}
                      <Typography variant="subtitle1" fontWeight="bold" marginLeft={1}>
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body1">{item.value}</Typography>
                  </InfoItem>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<Edit />} variant="contained" color="primary">
              Edit Account Info
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdate} variant="contained" color="primary">
                Save Changes
              </Button>
              <Button onClick={() => setEditMode(false)} variant="outlined" color="secondary" sx={{ marginLeft: 2 }}>
                Cancel
              </Button>
            </>
          )}
        </CardActions>
      </StyledCard>
    </Fade>
  )
}

export default AccountInfo

