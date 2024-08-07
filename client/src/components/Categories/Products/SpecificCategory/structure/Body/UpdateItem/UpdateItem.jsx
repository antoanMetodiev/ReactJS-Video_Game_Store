import { useRef } from "react";
import style from "./UpdateItem.module.css";
import { ref, update } from "firebase/database";
import { database } from "../../../../../../../firebase/firebase";

export const UpdateItem = ({
	productList,
	allProducts,
	setGameListHandler,
	renderGameList,
	setAllGamesListHandler,

}) => {
	const containerRef = useRef();

	const showUpdateGameHandler = () => {
		containerRef.current.classList.remove(style['fade-out']);
		containerRef.current.classList.add(style['fade-in']);
		containerRef.current.style.display = "block";
	};

	const hideUpdateGameHandler = () => {
		containerRef.current.classList.remove(style['fade-in']);
		containerRef.current.classList.add(style['fade-out']);

		setTimeout(() => {
			containerRef.current.style.display = "none";
			containerRef.current.classList.remove(style['fade-out']);
		}, 400);
	};

	function updateGameHandler(event) {
		event.preventDefault();

		const searchedGame = event.target.game_name.value;
		const newGameName = event.target.new_game_name.value;
		const newPrice = event.target.price.value;
		const newDescription = event.target.description.value;

		const newimageUrl = event.target.image_url.value;
		const newOtherImageUrl = event.target.other_images_url.value;
		const newTrailerUrl = event.target.trailer.value;

		// Намери играта по име
		const oldObjectGame = productList.find((game) => game.name === searchedGame);
		if (!oldObjectGame) {
			console.log(`Game ${searchedGame} not found!!!`);
			return;
		}

		const desc = newDescription.split(",# ");
		const otherImages = newOtherImageUrl.split(", ");

		const newObjectGame = {
			description: desc[0].trim().length > 0 ? desc : oldObjectGame.description,
			name: newGameName.trim() ? newGameName : oldObjectGame.name,
			price: newPrice > 0 ? newPrice : oldObjectGame.price,
			imageUrl: newimageUrl.trim() ? newimageUrl : oldObjectGame.imageUrl,
			otherImageUrl:
				otherImages[0].trim().length > 0
					? otherImages
					: oldObjectGame.otherImageUrl,
			trailer: newTrailerUrl.trim() ? newTrailerUrl : oldObjectGame.trailer,
		};


		let paths = location.pathname.split('/');
		paths.shift();

		//   Example:
		let specifiCategory = paths[1];  // Games
		let subCategory = paths[2];      // Ps5-Games

		// debugger;
		if (specifiCategory.toLocaleLowerCase() === 'games') specifiCategory = "game";

		let baseUrl = `${specifiCategory}/${subCategory}`;

		if (subCategory == undefined) {
			baseUrl = specifiCategory;
		}


		const gameRef = ref(database, `${baseUrl}/${oldObjectGame._id}`);

		// Изпрати заявка за актуализиране
		update(gameRef, newObjectGame).catch((error) => {
			console.error("Error updating game:", error);
		});

		newObjectGame._id = gameRef._path.pieces_[2];
		renderGameList.current = true;

		let allGamesIndex = allProducts.indexOf(oldObjectGame); // old game index in arr
		let gameListIndex = productList.indexOf(oldObjectGame); // old game index in arr

		let newCurrentList = productList.filter(game => game.name !== oldObjectGame.name);
		allProducts = allProducts.filter(game => game.name !== oldObjectGame.name);

		newCurrentList.splice(gameListIndex, 0, newObjectGame);
		allProducts.splice(allGamesIndex, 0, newObjectGame);

		setGameListHandler(newCurrentList); // присвоявам си новата стойност
		setAllGamesListHandler(allProducts);   // присвоявам си новата стойност

		// ---------------------------
		event.target.game_name.value = "";
		event.target.new_game_name.value = "";
		event.target.price.value = "";
		event.target.description.value = "";
		event.target.image_url.value = '';
		event.target.other_images_url.value = '';
		event.target.trailer.value = '';
	}

	return (
		<>
			<article className={style["create-game-container"]} ref={containerRef}>
				{/* <img className={style['lets-goo-image']} src={letsGooImage} alt="lets-goo-image" /> */}

				<form onSubmit={updateGameHandler}>
					<span onClick={hideUpdateGameHandler} className={style["x-button"]}>
						X
					</span>
					<div>
						<label htmlFor="game-name">Name of the game</label>
						<input type="text" id="game-name" name="game_name" required />
					</div>

					<div>
						<label htmlFor="game-name">New Game Name</label>
						<input
							type="text"
							id="new-game-name"
							name="new_game_name"
							required
						/>
					</div>

					<div>
						<label htmlFor="price">Price (EU)</label>
						<input type="number" id="price" name="price" required />
					</div>

					<div>
						<label htmlFor="img-url">Game Picture Url</label>
						<input type="text" id="img-url" name="image_url" required />
					</div>

					<div>
						<label htmlFor="img-url">Other Pictures Url</label>
						<input
							type="text"
							id="other-images-url"
							name="other_images_url"
							required
						/>
					</div>

					<div>
						<label htmlFor="trailer-video">Trailer Video</label>
						<input type="text" id="trailer-video" name="trailer" required />
					</div>

					<div>
						<label htmlFor="description">Description</label>
						<textarea
							name="description"
							id="description"
							placeholder="Write Something..."
							required
						></textarea>
					</div>

					<button type="submit">Update Item</button>
				</form>
			</article>

			<button
				onClick={showUpdateGameHandler}
				className={style["show-game-create"]}
			>
				Update Item
			</button>
		</>
	);
};
