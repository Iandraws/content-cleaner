import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Alert,
  IconButton,
  Snackbar,
  Box,
  Paper,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { AxiosError } from "axios";
import { cleanText } from "../api/cleanerApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface CleanTextResponse {
  clean: string;
}

export default function CleanerForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [raw, setRaw] = useState("");
  const [clean, setClean] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onClean = async () => {
    if (!raw.trim()) return;
    setErr(null);
    setLoading(true);

    try {
      const { clean } = (await cleanText(raw)) as CleanTextResponse;
      setClean(clean);
    } catch (error) {
      const axErr = error as AxiosError<{ detail?: string }>;
      const status = axErr.response?.status;

      if (status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (axErr.response?.data?.detail) {
        setErr(axErr.response.data.detail);
      } else {
        setErr(status ? `Clean failed (HTTP ${status})` : "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = async (txt: string) => {
    if (!txt) return;
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 64px)",
        display: "grid",
        placeItems: "center",
        p: { xs: 1.5, sm: 2 },
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#f6f7fb" : "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 900,       
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Raw input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            multiline
            minRows={8}
            fullWidth
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              onClick={onClean}
              disabled={!raw.trim() || loading}
            >
              {loading ? "Cleaning…" : "Clean"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setRaw("")}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Stack>

          {err && <Alert severity="error">{err}</Alert>}

          <TextField
            label="Clean output"
            value={clean}
            multiline
            minRows={8}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <Stack direction="row" justifyContent="flex-end">
            <IconButton onClick={() => copy(clean)} disabled={!clean}>
              <ContentCopy />
            </IconButton>
          </Stack>

          <Snackbar
            open={copied}
            autoHideDuration={1500}
            onClose={() => setCopied(false)}
            message="Copied!"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
