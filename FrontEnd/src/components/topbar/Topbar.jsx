import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './topbar.css';
//import { response } from '../../../../BackEnd/app';

export const Topbar = () => {
    const [activePage, setActivePage] = useState('');
    const [isAdmin, setIsAdmin] = useState(null); 
    const location = useLocation();
    

    useEffect(() => {
        // useLocation의 pathname을 기반으로 현재 페이지 설정
        setActivePage(location.pathname);
    }, [location]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 관리자 상태를 가져옴
        fetch('http://localhost:3000/api/getLoginId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                fetch(`http://localhost:3000/api/admin?id=${data.user_key}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((admin) => {
                        console.log('관리자 상태를 가져왔습니다.');
                        setIsAdmin(admin.user_admin);
                    })
                    .catch((error) => {
                        console.error('관리자 상태를 가져오는 중 오류 발생:', error);
                    });
            })
            .catch((error) => {
                console.error('로그인 ID를 가져오는 중 오류 발생:', error);
                alert("로그인 에러가 발생했습니다. 다시 로그인 해주세요.");
                window.location.href = '/';
            });
    }, []);
    const handleBoardClick = () => {
        if (isAdmin === null) {
            console.log('관리자 상태를 확인 중입니다.');
            return;
        }
        // '게시판' 클릭 시 실행할 함수
        console.log('게시판 클릭');
        if (isAdmin === 1) {
            console.log('사용자가 관리자입니다');
            window.location.href = '/manager/board';
        } else if (isAdmin === 0) {
            console.log('사용자가 관리자가 아닙니다');
            window.location.href = '/board';
        }
    };

    return (
        <div className="topbar">
            <div className="topbar-wrapper">
                <div>
                    <Link to="/main" className="topbar-title">
                        가상투자시뮬
                    </Link>
                </div>
                <ul className="topbar-menu-wrapper">
                    <li className={`topbar-menu ${activePage === '/investment' ? 'active' : ''}`}>
                        <Link to="/investment">가상투자</Link>
                    </li>
                    <li className="topbar-menu">
                        <button onClick={handleBoardClick} className={`topbar-button ${activePage === '/board' ||
                                activePage === '/board/view' ||
                                activePage === '/board/modify' ||
                                activePage === '/board/write' ||
                                activePage === '/manager/board' ||
                                activePage === '/manager/board/view' ||
                                activePage === '/manager/board/modify' ||
                                activePage === '/manager/board/write'
                                ? 'active'
                            : ''
                                }`}>게시판</button>
                    </li>
                    <li className={`topbar-menu ${activePage === '/mypage' ? 'active' : ''}`}>
                        <Link to="/mypage">마이페이지</Link>
                    </li>
                    <li className={`topbar-menu ${activePage === '/stockInfo' ? 'active' : ''}`}>
                        <Link to="/stockInfo?itmsNm=두산">주식 상세정보</Link>
                    </li>
                    <li className={`topbar-menu ${activePage === '/search' ? 'active' : ''}`}>
                        <Link to="/search">검색</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Topbar;
