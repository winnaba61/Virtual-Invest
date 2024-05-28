import React, { useEffect, useState } from 'react';
import './investment.css';
import { Topbar } from '../../../components/topbar/Topbar';
import { stockDB } from '../../../data/stockDB';
import { useLocation } from 'react-router-dom';

export const Investment = () => {
    const [activeUnit, setActiveUnit] = useState('주'); // 초기 단위를 '주'로 설정
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const stockId = searchParams.get('stockId') || '1'; // 기본값으로 '1'을 사용
    const stockDetail = stockDB.find((stock) => stock.id === stockId);
    const [currentPrice, setCurrentPrice] = useState(null); // 현재가 데이터를 위한 상태
    const [currentWallet, setCurrentWallet] = useState(null); // 현재 보유 자산
    const [investmentValue, setInvestmentValue] = useState('');

    useEffect(() => {
        // 서버로부터 현재가 데이터를 요청
        fetch('http://localhost:3000/api/current-price')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((price_data) => {
                console.log('Received data:', price_data); // 디버깅 로그 추가
                setCurrentPrice(price_data.clpr);
            })
            .catch((error) => {
                console.error('Error fetching current price:', error);
            });
    }, []);

    useEffect(() => {
        // 서버로부터 보유 자산 데이터를 요청
        fetch('http://localhost:3000/api/current-wallet')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((wallet_data) => {
                console.log('Received data:', wallet_data); // 디버깅 로그 추가
                setCurrentWallet(wallet_data.user_wallet);
            })
            .catch((error) => {
                console.error('Error fetching:', error);
            });
    }, []);

    const handleButtonClickBuy = () => {
        // 투자 버튼 클릭 시 동작
        if (activeUnit === '주') {
            const investmentAmount = parseInt(investmentValue) * currentPrice;
            console.log('매수:', investmentAmount);
            const remainingBalance = currentWallet - investmentAmount;

            // 서버로 투자한 주 수, 잔여 잔고를 전달
            fetch('http://localhost:3000/api/invest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    investmentAmount: Math.floor(investmentAmount / currentPrice),
                    remainingBalance,
                    buy_money: Math.floor(investmentAmount / currentPrice) * currentPrice,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Investment successful:', data);
                    // 투자가 성공하면 마이페이지로 이동
                    window.location.href = 'http://localhost:5173/mypage';
                })
                .catch((error) => {
                    console.error('Error investing:', error);
                    // 투자에 실패하면 오류 메시지 출력
                    alert('투자에 실패했습니다. 다시 시도해주세요.');
                });
        } else {
            const investmentAmount = parseInt(investmentValue);
            console.log('매수:', investmentAmount);

            // 서버로 투자 금액을 전달
            fetch('http://localhost:3000/api/invest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    investmentAmount: Math.floor(investmentValue / currentPrice),
                    remainingBalance: currentWallet - Math.floor(investmentValue / currentPrice) * currentPrice, // 잔여 잔고는 변경된 금액으로 계산
                    buy_money: Math.floor(investmentAmount / currentPrice) * currentPrice,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Investment successful:', data);
                    // 투자가 성공하면 마이페이지로 이동
                    window.location.href = 'http://localhost:5173/mypage';
                })
                .catch((error) => {
                    console.error('Error investing:', error);
                    // 투자에 실패하면 오류 메시지 출력
                    alert('투자에 실패했습니다. 다시 시도해주세요.');
                });
        }
    };

    const handleButtonClickSell = () => {
        // 매도 버튼 클릭 시 동작
        if (activeUnit === '주') {
            const SellAmount = parseInt(investmentValue) * currentPrice;
            console.log('매도:', SellAmount);
            const remainingBalance = currentWallet + SellAmount;

            // 서버로 매도한 주 수, 잔여 잔고를 전달
            fetch('http://localhost:3000/api/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellAmount: Math.floor(SellAmount / currentPrice),
                    remainingBalance,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Sell successful:', data);
                    // 매도에 성공하면 마이페이지로 이동
                    window.location.href = 'http://localhost:5173/mypage';
                })
                .catch((error) => {
                    console.error('Error selling:', error);
                    // 매도에 실패하면 오류 메시지 출력
                    alert('매도에 실패했습니다. 다시 시도해주세요.');
                });
        } else {
            const SellAmount = parseInt(investmentValue);
            console.log('매도:', SellAmount);

            // 서버로 매도 금액을 전달
            fetch('http://localhost:3000/api/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellAmount: Math.floor(SellAmount / currentPrice),
                    remainingBalance: currentWallet + Math.floor(SellAmount / currentPrice) * currentPrice, // 잔여 잔고는 변경된 금액으로 계산
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Sell successful:', data);
                    // 매도에 성공하면 마이페이지로 이동
                    window.location.href = 'http://localhost:5173/mypage';
                })
                .catch((error) => {
                    console.error('Error selling:', error);
                    // 매도에 실패하면 오류 메시지 출력
                    alert('매도에 실패했습니다. 다시 시도해주세요.');
                });
        }
    };

    const handleUnitClick = (unit) => {
        setActiveUnit(unit); // 클릭된 단위로 상태 업데이트
    };

    const handleInputChange = (e) => {
        setInvestmentValue(e.target.value);
    };

    return (
        <>
            <Topbar />
            <div className="investment">
                <div className="investment-table-container">
                    <div className="investment-title" id="stock-name">
                        {stockDetail.itmsNm}
                    </div>
                    <table className="investment-table">
                        <tr>
                            <th>현재가</th>
                            <td>{currentPrice !== null ? currentPrice : 'Loading...'}</td>
                        </tr>
                        <tr>
                            <th>1주 당 가격</th>
                            <td>{currentPrice !== null ? currentPrice : 'Loading...'}</td>
                        </tr>
                        <tr>
                            <th>현재 보유 자산</th>
                            <td>{currentWallet !== null ? currentWallet : 'Loading...'}</td>
                        </tr>
                        <tr>
                            <th>가능 투자 주수</th>
                            <td>{Math.floor(currentWallet / currentPrice)}</td>
                        </tr>
                    </table>
                </div>
                <div className="investment-unit-container">
                    <div className="investment-title">단위 설정</div>
                    <button
                        className={`investment-unit-button ${activeUnit === '주' ? 'active' : ''}`}
                        onClick={() => handleUnitClick('주')}
                    >
                        주
                    </button>
                    <button
                        className={`investment-unit-button ${activeUnit === '원' ? 'active' : ''}`}
                        onClick={() => handleUnitClick('원')}
                    >
                        원
                    </button>
                </div>
                <div className="investment-price-container">
                    <div className="investment-title">투자 금액 입력</div>
                    <input
                        className="investment-price"
                        type="number"
                        value={investmentValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="investment-pagination">
                    <button className="investment-pagination-button" onClick={handleButtonClickBuy}>
                        매수
                    </button>
                    <button className="investment-pagination-button" onClick={handleButtonClickSell}>
                        매도
                    </button>
                </div>
            </div>
        </>
    );
};
