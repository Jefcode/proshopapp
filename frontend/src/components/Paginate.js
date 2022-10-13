import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          const toPage = x + 1;

          return (
            <LinkContainer
              key={toPage}
              to={
                isAdmin
                  ? `/admin/productlist/page/${toPage}`
                  : keyword
                  ? `/search/${keyword}/page/${toPage}`
                  : `/page/${toPage}`
              }
            >
              <Pagination.Item active={toPage === page}>
                {toPage}
              </Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;
