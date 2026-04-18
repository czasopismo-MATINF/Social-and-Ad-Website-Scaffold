import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip
} from "@mui/material";

function resolveSortOrder(history, filters) {
  // 1. Brak historii → domyślne sortowanie
  if (history.length === 0) {
    return ["title,asc", "updatedAt,desc"];
  }

  const has0 = history.includes(0);
  const has1 = history.includes(1);

  // 2. Tylko title
  if (has0 && !has1) {
    return [filters.sortTitle, filters.sortUpdatedAt];
  }

  // 3. Tylko updatedAt
  if (has1 && !has0) {
    return [filters.sortUpdatedAt, filters.sortTitle];
  }

  // 4. Znajdź ostatnią zmianę (ostatnią parę różnych wartości)
  let lastChangePrev = null;
  let lastChangeCurr = null;

  for (let i = 1; i < history.length; i++) {
    if (history[i] !== history[i - 1]) {
      lastChangePrev = history[i - 1];
      lastChangeCurr = history[i];
    }
  }

  // Jeśli nie znaleziono zmiany (np. [0,0,0] lub [1,1,1]) — fallback
  if (lastChangePrev === null) {
    return history[history.length - 1] === 0
      ? [filters.sortTitle]
      : [filters.sortUpdatedAt];
  }

  // 5. Ostatnia zmiana decyduje
  if (lastChangePrev === 0 && lastChangeCurr === 1) {
    return [filters.sortTitle, filters.sortUpdatedAt];
  }

  if (lastChangePrev === 1 && lastChangeCurr === 0) {
    return [filters.sortUpdatedAt, filters.sortTitle];
  }

  // fallback
  return [filters.sortTitle, filters.sortUpdatedAt];
}


export default function AdsFilterForm({ categories, onFilterChange }) {

  const [filters, setFilters] = React.useState({
    page: "",
    size: "",
    sortTitle: "title,asc",
    sortUpdatedAt: "updatedAt,desc",
    sort: [],
    user: "",
    users: "",
    from: "",
    to: "",
    categories: [],
    keyword: ""
  });

  const handleChange = (field, value) => {
    if(field === "sortTitle") {
      setFilters(prev => ({ ...prev, [field]: value, "sort" : [...filters.sort, 0]}));
    } if(field === "sortUpdatedAt") {
      setFilters(prev => ({ ...prev, [field]: value, "sort" : [...filters.sort, 1]}));
    } else {
      setFilters(prev => ({ ...prev, [field]: value}));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Budowanie query string zgodnie z API
    const params = new URLSearchParams();

    //if (filters.page) params.append("page", filters.page);
    //if (filters.size) params.append("size", filters.size);

    //filters.sort.forEach(s => params.append("sort", s));
    const sortOrder = resolveSortOrder(filters.sort, filters);
    params.append("sort", sortOrder[0]);
    params.append("sort", sortOrder[1]);

    //if (filters.user) params.append("user", filters.user);
    //if (filters.users) params.append("users", filters.users); // CSV string

    if (filters.from) params.append("from", new Date(filters.from).toISOString());
    if (filters.to) params.append("to", new Date(filters.to).toISOString());

    if (filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }

    if (filters.keyword) params.append("keyword", filters.keyword);

    onFilterChange(params);
  };

  const getCategoryName = (id) => {
    return categories.filter(c => c.id === id)[0].description;
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        border: "1px solid #ddd",
        backgroundColor: "#fafafa"
      }}
    >
      <Grid container spacing={2}>

        {/* Keyword */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Słowo kluczowe"
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />
        </Grid>
{/*
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Użytkownik (UUID)"
            value={filters.user}
            onChange={(e) => handleChange("user", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Użytkownicy (CSV UUID)"
            value={filters.users}
            onChange={(e) => handleChange("users", e.target.value)}
          />
        </Grid>
*/}
        {/* Categories */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              multiple
              value={filters.categories}
              onChange={(e) => handleChange("categories", e.target.value)}
              renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <span style={{ color: "#888" }}>Wybierz kategorię</span>;
                  }
                  return (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {
                    selected.map((value) => (
                    <Chip key={value} label={getCategoryName(value)} />
                  ))}
                </Box>
              )}}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date from */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="datetime-local"
            label=""
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={(e) => handleChange("from", e.target.value)}
          />
        </Grid>

        {/* Date to */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="datetime-local"
            label=""
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={(e) => handleChange("to", e.target.value)}
          />
        </Grid>

        {/* Sort */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sortowanie</InputLabel>
            <Select
              value={filters.sortTitle}
              onChange={(e) => handleChange("sortTitle", e.target.value)}
              renderValue={(selected) => selected}
            >
              <MenuItem value="title,asc">Tytuł A-Z</MenuItem>
              <MenuItem value="title,desc">Tytuł Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sortowanie</InputLabel>
            <Select
              value={filters.sortUpdatedAt}
              onChange={(e) => handleChange("sortUpdatedAt", e.target.value)}
              renderValue={(selected) => selected}
            >
              <MenuItem value="updatedAt,desc">Najnowsze</MenuItem>
              <MenuItem value="updatedAt,asc">Najstarsze</MenuItem>
            </Select>
          </FormControl>
        </Grid>
{/*
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Strona"
            type="number"
            value={filters.page}
            onChange={(e) => handleChange("page", e.target.value)}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Rozmiar strony"
            type="number"
            value={filters.size}
            onChange={(e) => handleChange("size", e.target.value)}
          />
        </Grid>
*/}
        {/* Submit */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Filtruj ogłoszenia
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
}
