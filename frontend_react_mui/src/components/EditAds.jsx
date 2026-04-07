import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected, userAdsCollected } from '../../store/slice.js'

import keycloak from "../keycloak.js";

/*
const articleInfo = [
  {
    tag: 'Engineering',
    title: 'The future of AI in software engineering',
    description:
      'Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality.',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
];
*/

function getUserAds(keycloak, dispatch, userInfo, pageNumber, pageSize, setAds) {
    console.log("GETTING USER ADS");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping user info fetch");
      return;
    }
    fetch(`http://localhost:3020/ads?user=${userInfo.id}&page=${pageNumber}&size=${pageSize}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("USER ADS FETCHED", data);
      setAds(data);
      dispatch(userAdsCollected(data));
    });

}

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '3px',
    borderRadius: '8px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: (theme.vars || theme).palette.text.primary,
    opacity: 0.3,
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  '&:hover::before': {
    width: '100%',
  },
}));

function Author({ authors, updatedAt }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">{updatedAt}</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default function EditAds() {

  const userInfo = useSelector(state => state.example.userInfo);
  //const userAds = useSelector(state => state.example.userAds);

  const dispatch = useDispatch();

  const [page, setPage] = React.useState(0);
  const [ads, setAds] = React.useState(null);
  
  useEffect(() => {
    if (userInfo?.id) {
        getUserAds(keycloak, dispatch, userInfo, page, 4, setAds);
    }
  }, [userInfo, page]);

  const handlePageChange = (_, value) => {
    setPage(value - 1); // MUI -> Spring Data
  };

  /*
  const [articleInfo, setArticleInfo] = React.useState([]);

    useEffect(() => {
    if (userAds !== null && userAds !== undefined) {
        setArticleInfo(
        userAds.content.map(ad => ({
            tag: ad.category,
            title: ad.title,
            description: ad.content,
            authors: ad.authors
        }))
        );
    }
    }, [userAds]);
*/

  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Ogłoszenia użytkownika
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {ads?.content?.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                height: '100%',
              }}
            >
              <Typography gutterBottom variant="caption" component="div">
                {article.category}
              </Typography>
              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
              >
                {article.title}{article.id}
                <NavigateNextRoundedIcon
                  className="arrow"
                  sx={{ fontSize: '1rem' }}
                />
              </TitleTypography>
              <StyledTypography
                variant="body2"
                gutterBottom
                sx={{ color: 'text.secondary' }}
              >
                {article.content}
              </StyledTypography>
              <Author authors={[{name : keycloak.tokenParsed.preferred_username}]} updatedAt={article.updatedAt} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
        <Pagination
            page={(ads?.number ?? 0) + 1}      // Spring → MUI
            count={ads?.totalPages ?? 1}       // liczba stron
            onChange={handlePageChange}
            color="primary"
            boundaryCount={2}
        />
      </Box>
    </div>
  );
}
