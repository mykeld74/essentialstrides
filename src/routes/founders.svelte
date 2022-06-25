<script>
	import Img from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1>Meet Our Founders:</h1>
	<div class="blue">
		<div class="headshot">
			<Img source="headshotBlue" altText="Dr. Kevin Blue" />
		</div>
		<p>
			Kevin Blue, DPM, FACFAS, is a sports medicine fellowship-trained surgical podiatrist that is
			double-board certified. He is dedicated to providing advanced care for foot and ankle
			conditions in patients of all ages, including young children, teens, and seniors.
		</p>
		<p>
			Dr. Blue is a Parker, Colorado Podiatrist, and is fully qualified in the forefoot, rearfoot,
			and ankle surgery. He completed his medical degree at the California School of Podiatric
			Medicine at Samuel Merritt University, followed by a three-year surgical residency at
			Highlands/Presbyterian St. Luke’s in Denver, where he performed more than 2,400 surgical
			procedures with an emphasis on traumatic injuries and reconstruction. In addition, he
			completed a one-year fellowship in sports medicine podiatry, treating patients of all ages,
			including children.
		</p>
		<p>
			Dr. Blue is committed to providing patient-centered care and treatment programs tailored to
			the specific needs of each patient, in addition to providing education and information to help
			patients play an active role in their care. His practice helps athletes of all levels,
			including student-athletes, recover from injuries and other foot- and ankle-related issues so
			they can enjoy a rapid return to the activities they love.
		</p>
		<p>
			Contact: <a href="https://www.footsportsmed.com/" target="_blank" rel="noopener noreferrer"
				>www.footsportsmed.com</a
			>
		</p>
	</div>
	<div class="molchan">
		<div class="headshot">
			<Img source="headshotMolchan" altText="Dr. Lauren Molchan" />
		</div>
		<p>
			Dr. Lauren Molchan, DPM, AACFAS is a skilled and compassionate podiatrist practicing at Foot
			Specialists Associates in Denver, Colorado.
		</p>

		<p>
			Dr. Molchan began her undergraduate education at the University of Tennessee, where she pole
			vaulted on their women’s track team. She later graduated from Moravian College with her BS in
			biology, where she continued her collegiate athletic career. She then worked in clinical
			research at UCLA, where she developed her interest in surgery. Her combined passion for sports
			and medicine led her to pursue her Doctorate in Podiatric Medicine & Surgery from the Western
			University of Health Sciences in Pomona, California.
		</p>

		<p>
			Dr. Molchan completed her three-year foot and ankle surgery residency in Denver, Colorado, at
			Highlands-Presbyterian/St. Luke’s Medical Center and served as chief resident in her final
			year. Her training involved exposure to all aspects of foot and ankle surgery. She is the
			youngest member of the board of directors for the Colorado Podiatric Medical Association and
			participates in training surgical residents as an attending in the Denver area. Dr. Molchan
			has a passion for global medicine.
		</p>

		<p>
			She enjoys treating a wide variety of foot and ankle pathologies, including sports injuries,
			trauma, pediatrics, forefoot and rearfoot deformities, arthroscopy, arthritic conditions, and
			total joint replacement. Her mission is to provide superior comprehensive foot and ankle care
			while adhering to principles of focused and patient-centered care. She believes the best
			outcomes are achieved when both the patient and physician work as a team. She is excited to
			serve the greater Denver community that she trained in. In her spare time, she enjoys yoga,
			hiking, skiing, rock climbing, and painting.
		</p>
		<p>
			Contact: <a href="https://www.coloradofootcare.com/" target="_blank" rel="noopener noreferrer"
				>www.coloradofootcare.com</a
			>
		</p>
	</div>
</div>

<style lang="scss">
	.headshot {
		width: 100%;
		max-width: 350px;
		float: left;
		margin: 0 20px 20px 0;
		padding: 0;
		box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
	}
	h1 {
		text-align: center;
		margin: 20px 0;
	}
	.blue {
		padding-bottom: 20px;
		border-bottom: 3px solid var(--primaryColor);
		margin-bottom: 20px;
	}
	a {
		color: var(--secondaryColor);
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}
</style>
